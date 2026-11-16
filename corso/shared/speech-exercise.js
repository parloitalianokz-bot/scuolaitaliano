/* Motore condiviso per esercizi orali (Speech-to-Text + fallback tastiera), turni e contributi append-only. */
(() => {
  "use strict";

  const DEFAULT_SPECIAL_CHARS = ["'", "à", "è", "ì", "ò", "ù", "È"];
  const MIC_TIPS_RU = [
    "Используйте обновлённый Chrome и оставьте страницу открытой на переднем плане.",
    "Разрешите сайту доступ к микрофону и закройте другие приложения, которые могут его использовать.",
    "Подключите устройство к зарядке и отключите режим энергосбережения.",
    "Во время записи не блокируйте экран и не переключайтесь на другие приложения.",
    "По возможности используйте стабильное подключение к интернету."
  ];

  function createItalianCharToolbar(textarea, specialChars) {
    const toolbar = document.createElement("div");
    toolbar.className = "accent-toolbar";
    toolbar.setAttribute("aria-label", "Caratteri speciali italiani");
    specialChars.forEach(char => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = char;
      btn.setAttribute("aria-label", `Inserisci ${char}`);
      btn.addEventListener("mousedown", event => event.preventDefault());
      btn.addEventListener("click", () => {
        if (textarea.disabled) return;
        const start = textarea.selectionStart ?? textarea.value.length;
        const end = textarea.selectionEnd ?? textarea.value.length;
        textarea.value = textarea.value.slice(0, start) + char + textarea.value.slice(end);
        const nextPos = start + char.length;
        textarea.focus();
        textarea.setSelectionRange(nextPos, nextPos);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      });
      toolbar.appendChild(btn);
    });
    return toolbar;
  }

  function formatTimestamp(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (_) {
      return "";
    }
  }

  function formatAssigneeLabel(person, onlineSet) {
    if (!person) return "Nessuno";
    if (person.role === "teacher") return `👩‍🏫 ${person.name}`;
    const isOnline = onlineSet instanceof Set && onlineSet.has(person.name);
    return `${isOnline ? "🟢" : "⚪"} ${person.name}`;
  }

  function initSpeechExercise(config = {}) {
    const unitNumber = Number(config.unitNumber || 1);
    const exercisePath = String(
      config.exercisePath ||
      location.pathname.split("/").pop().replace(/\.html$/i, "").replace(/[.#$\/\[\]]/g, "_") ||
      "es_speech"
    );
    const cards = Array.isArray(config.cards) ? config.cards : [];
    const specialChars = Array.isArray(config.specialChars) && config.specialChars.length
      ? config.specialChars
      : DEFAULT_SPECIAL_CHARS;
    const lang = String(config.lang || "it-IT");

    if (!cards.length) {
      throw new Error("initSpeechExercise richiede almeno una scheda in `cards`.");
    }

    const session = window.ParloSession || {};
    const isTeacherView = Boolean(session.isTeacher);
    const safeGroup = session.safeGroup || "sconosciuto";
    const currentAuthorName = isTeacherView
      ? String(session.teacherName || session.name || "Insegnante").trim()
      : String(session.name || "").trim();

    const connectionBanner = document.getElementById("connection-banner");
    const questionsContainer = document.getElementById("questions-container");
    const navBar = document.getElementById("slide-navigation");
    const previousButton = document.getElementById("previous-question");
    const nextButton = document.getElementById("next-question");
    const progressText = document.getElementById("question-progress");
    const exerciseProgress = document.getElementById("exercise-progress");
    const nextExerciseLink = document.getElementById("next-exercise");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    const isMultiCard = cards.length > 1;

    if (exerciseProgress) exerciseProgress.hidden = !isMultiCard;
    if (previousButton) previousButton.hidden = !isMultiCard;
    if (nextButton) nextButton.hidden = !isMultiCard;
    if (progressText) progressText.hidden = !isMultiCard;

    const slots = cards.map((card, index) => ({
      id: `card_${index}`,
      label: `${index + 1}. ${card.title}`
    }));

    let sync = null;
    let activeCard = 0;
    let recordingCardIndex = null;
    let recognition = null;
    let finalizedText = "";
    let latestFullTranscript = "";
    let manualStopRequested = false;
    let savingAutoContribution = false;

    const cardUI = [];
    const draftTimers = new Map();
    const feedbackTimers = new Map();

    function setConnectionMessage(message) {
      if (!connectionBanner) return;
      if (!message) {
        connectionBanner.hidden = true;
        connectionBanner.textContent = "";
      } else {
        connectionBanner.textContent = message;
        connectionBanner.hidden = false;
      }
    }

        function notifyClassroomNotesScope(index) {
      const card = cards[index];
      const scopeKey = String(card?.key || `card_${index}`).replace(/[.#$\/\[\]]/g, "_");
      window.ParloNotesScope = {
        group: safeGroup,
        exercise: exercisePath,
        card: scopeKey,
        cardLabel: card?.title || `Scheda ${index + 1}`
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", {
        detail: window.ParloNotesScope
      }));
    }

    function setCardFeedback(index, type, message, autoClearMs = 0) {
      const ui = cardUI[index];
      if (!ui) return;
      clearTimeout(feedbackTimers.get(index));
      feedbackTimers.delete(index);

      ui.syncFeedback.className = `sync-feedback ${type || ""}`.trim();
      ui.syncFeedback.textContent = message || "";

      if (autoClearMs > 0 && message) {
        feedbackTimers.set(index, setTimeout(() => {
          feedbackTimers.delete(index);
          ui.syncFeedback.className = "sync-feedback";
          ui.syncFeedback.textContent = "";
        }, autoClearMs));
      }
    }

    function scheduleDraftSync(index, text) {
      if (!sync) return;
      const slotId = slots[index].id;
      if (!sync.canWrite(slotId)) return;

      clearTimeout(draftTimers.get(index));
      draftTimers.set(index, setTimeout(() => {
        draftTimers.delete(index);
        if (sync.canWrite(slotId)) {
          sync.write("draft", text, slotId).catch(error => {
            setCardFeedback(index, "error", `⚠️ Errore sincronizzazione: ${error?.message || "riprova"}`);
          });
        }
      }, 150));
    }

    async function commitContribution(index, rawText, sourceMode = "voice") {
      const cleaned = String(rawText || "").trim();
      if (!cleaned) return false;
      if (!sync) {
        setCardFeedback(index, "error", "⚠️ Connessione al database non disponibile: impossibile salvare.");
        return false;
      }
      const slotId = slots[index].id;
      if (!sync.canWrite(slotId)) {
        setCardFeedback(index, "error", "⚠️ Non hai il turno attivo per questa scheda.");
        return false;
      }

      clearTimeout(draftTimers.get(index));
      draftTimers.delete(index);
      setCardFeedback(index, "saving", "⏳ Salvataggio contributo in corso...");

      try {
        await sync.push("contributions", {
          questionKey: cards[index].key || `card_${index + 1}`,
          text: cleaned,
          inputMode: sourceMode,
          authorName: currentAuthorName || "Partecipante",
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }, slotId);
        await sync.write("draft", "", slotId);
        const ui = cardUI[index];
        if (ui) {
          ui.liveBox.textContent = "Здесь появится распознанный текст...";
          ui.liveBox.classList.add("placeholder");
          ui.keyboardInput.value = "";
        }
        setCardFeedback(index, "saved", "✓ Contributo salvato", 3500);
        return true;
      } catch (error) {
        setCardFeedback(index, "error", `⚠️ Errore durante il salvataggio: ${error?.message || "riprova"}`);
        return false;
      }
    }

    function updateMicButtonUI(index, active) {
      const ui = cardUI[index];
      if (!ui) return;
      ui.micBtn.classList.toggle("recording", active);
      ui.micBtn.textContent = active
        ? "⏹️ Закончить и сохранить · Ferma e salva"
        : "🎤 Начать говорить · Parla col microfono";
    }

    async function handleRecordingEnded(index, reasonMessage = "") {
      if (savingAutoContribution) return;
      savingAutoContribution = true;

      const ui = cardUI[index];
      const textToSave = (latestFullTranscript || (ui && !ui.liveBox.classList.contains("placeholder") ? ui.liveBox.textContent : "")).trim();

      recordingCardIndex = null;
      finalizedText = "";
      latestFullTranscript = "";
      updateMicButtonUI(index, false);

      if (textToSave) {
        const ok = await commitContribution(index, textToSave, "voice");
        if (ok && reasonMessage) {
          setCardFeedback(index, "saved", `✓ Trascrizione salvata (${reasonMessage}). Puoi riattivare il microfono per continuare.`, 6000);
        }
      } else if (reasonMessage) {
        setCardFeedback(index, "error", reasonMessage);
      }

      savingAutoContribution = false;
      if (ui) ui.micBtn.disabled = !(sync && sync.canWrite(slots[index].id));
    }

    function stopSpeechRecognition(manual = true) {
      manualStopRequested = manual;
      if (recognition) {
        try { recognition.stop(); } catch (_) {}
      } else if (recordingCardIndex !== null) {
        handleRecordingEnded(recordingCardIndex);
      }
    }

    function setKeyboardMode(index, enabled) {
      const ui = cardUI[index];
      if (!ui) return;
      ui.isKeyboardMode = Boolean(enabled);
      ui.modeVoiceBtn.classList.toggle("active", !ui.isKeyboardMode);
      ui.modeVoiceBtn.setAttribute("aria-pressed", String(!ui.isKeyboardMode));
      ui.modeKeyboardBtn.classList.toggle("active", ui.isKeyboardMode);
      ui.modeKeyboardBtn.setAttribute("aria-pressed", String(ui.isKeyboardMode));

      ui.voicePanel.hidden = ui.isKeyboardMode;
      ui.keyboardPanel.hidden = !ui.isKeyboardMode;

      if (ui.isKeyboardMode) {
        if (recordingCardIndex === index) stopSpeechRecognition(true);
        const currentDraft = (sync && sync.read("draft", slots[index].id)) || "";
        if (currentDraft && !ui.keyboardInput.value) {
          ui.keyboardInput.value = currentDraft;
        }
        if (!ui.keyboardInput.disabled) ui.keyboardInput.focus();
      }
    }

    function startSpeechRecognition(index) {
      const slotId = slots[index].id;
      if (!sync || !sync.canWrite(slotId)) {
        setCardFeedback(index, "error", "⚠️ Non hai il turno attivo per parlare.");
        return;
      }
      if (!SpeechRecognition) {
        setCardFeedback(
          index,
          "error",
          "⚠️ Questo browser non supporta il riconoscimento vocale: usa la modalità tastiera qui sotto."
        );
        setKeyboardMode(index, true);
        return;
      }
      if (recordingCardIndex !== null && recordingCardIndex !== index) {
        stopSpeechRecognition(true);
      }

      const existingDraft = String((sync && sync.read("draft", slotId)) || "").trim();
      finalizedText = existingDraft ? `${existingDraft} ` : "";
      latestFullTranscript = finalizedText.trim();
      manualStopRequested = false;

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang;
      recognition = rec;
      recordingCardIndex = index;
      updateMicButtonUI(index, true);
      setCardFeedback(index, "saving", "🎙️ Registrazione attiva: parla in italiano...");

      rec.onresult = event => {
        if (recordingCardIndex !== index) return;
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalizedText += piece;
          } else {
            interim += piece;
          }
        }
        const combined = `${finalizedText}${interim}`.replace(/\s+/g, " ").trim();
        latestFullTranscript = combined;

        const ui = cardUI[index];
        if (ui) {
          ui.liveBox.textContent = combined || "Здесь появится распознанный текст...";
          ui.liveBox.classList.toggle("placeholder", !combined);
        }
        scheduleDraftSync(index, combined);
      };

      rec.onerror = event => {
        const errCode = event?.error || "unknown";
        if (errCode === "no-speech") return;

        if (errCode === "audio-capture" || errCode === "not-allowed") {
          manualStopRequested = true;
          handleRecordingEnded(
            index,
            "⚠️ Microfono non disponibile (forse occupato da Google Meet). Passa a «Scrivi da tastiera»."
          );
          setKeyboardMode(index, true);
          return;
        }

        manualStopRequested = true;
        handleRecordingEnded(index, `microfono scollegato: ${errCode}`);
      };

      rec.onend = () => {
        if (recordingCardIndex !== index) return;
        // Se il microfono si scollega o si interrompe, salva subito ciò che è stato registrato come nuova voce
        const reason = manualStopRequested ? "" : "microfono scollegato";
        recognition = null;
        handleRecordingEnded(index, reason);
      };

      try {
        rec.start();
      } catch (error) {
        recordingCardIndex = null;
        recognition = null;
        updateMicButtonUI(index, false);
        setCardFeedback(index, "error", `⚠️ Impossibile avviare il microfono: ${error?.message || "usa la tastiera"}`);
      }
    }

    cards.forEach((card, index) => {
      const slotId = slots[index].id;
      const box = document.createElement("div");
      box.className = "section-box";
      box.hidden = index !== activeCard;

      const header = document.createElement("div");
      header.className = "section-header";

      const title = document.createElement("div");
      title.className = "section-title";
      const numSpan = document.createElement("span");
      numSpan.className = "number";
      numSpan.textContent = String(index + 1);
      const textSpan = document.createElement("span");
      textSpan.textContent = card.title;
      title.append(numSpan, textSpan);

      const turnPill = document.createElement("span");
      turnPill.className = "turn-pill";
      turnPill.textContent = "🎤 Turno: Nessuno";

      header.append(title, turnPill);

      // Assegnazione turno (solo insegnante)
      const assignmentBar = document.createElement("div");
      assignmentBar.className = "turn-assignment-bar";
      assignmentBar.hidden = !isTeacherView;

      const assignLabel = document.createElement("label");
      assignLabel.htmlFor = `assign-turn-${index}`;
      assignLabel.textContent = "🎤 Assegna turno orale:";

      const assignSelect = document.createElement("select");
      assignSelect.id = `assign-turn-${index}`;
      if (isTeacherView) {
        assignmentBar.append(assignLabel, assignSelect);
      }

      // Contenuto guida della scheda (es. incipit + lista domande per racconto, oppure sottotitolo)
      let promptBlock = null;
      if (card.intro || card.starter || (Array.isArray(card.prompts) && card.prompts.length)) {
        promptBlock = document.createElement("div");
        promptBlock.className = "speech-prompts";
        if (card.intro) {
          const introP = document.createElement("p");
          introP.className = "speech-prompts-intro";
          introP.textContent = card.intro;
          promptBlock.appendChild(introP);
        }
        if (card.starter) {
          const starterP = document.createElement("p");
          starterP.className = "story-starter";
          starterP.textContent = card.starter;
          promptBlock.appendChild(starterP);
        }
        if (Array.isArray(card.prompts) && card.prompts.length) {
          const viewport = document.createElement("div");
          viewport.className = "speech-prompts-viewport";
          viewport.tabIndex = 0;
          viewport.setAttribute("aria-label", "Domande guida scorrevoli");
          const ol = document.createElement("ol");
          card.prompts.forEach(pText => {
            const li = document.createElement("li");
            li.textContent = pText;
            ol.appendChild(li);
          });
          viewport.appendChild(ol);
          promptBlock.appendChild(viewport);
        }
      }

      // Consigli espandibili per registrazione stabile del microfono (in russo)
      const tipsDetails = document.createElement("details");
      tipsDetails.className = "didactic-hints";
      const tipsSummary = document.createElement("summary");
      tipsSummary.textContent = "🎙️ Советы для стабильной записи микрофона";
      tipsSummary.lang = "ru";
      const tipsBody = document.createElement("div");
      tipsBody.className = "didactic-hints-body";
      tipsBody.lang = "ru";
      const tipsList = document.createElement("ul");
      MIC_TIPS_RU.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        tipsList.appendChild(li);
      });
      tipsBody.appendChild(tipsList);
      tipsDetails.append(tipsSummary, tipsBody);

      // Area di produzione (Speech-to-Text condiviso + alternativa tastiera per smartphone/Meet)
      const productionCard = document.createElement("div");
      productionCard.className = "answer-form-card";

      const prodHeader = document.createElement("div");
      prodHeader.className = "answer-form-header";
      const prodLabel = document.createElement("span");
      prodLabel.className = "prod-label";
      prodLabel.textContent = "🗣️ Trascrizione in tempo reale:";
      const turnHintTag = document.createElement("span");
      turnHintTag.className = "turn-hint-tag";
      turnHintTag.textContent = "In attesa di assegnazione";
      prodHeader.append(prodLabel, turnHintTag);

      // Selettore modalità input (visibile a chi ha il turno, utile su smartphone con Google Meet)
      const modeSwitch = document.createElement("div");
      modeSwitch.className = "input-mode-switch";
      modeSwitch.hidden = true;

      const modeVoiceBtn = document.createElement("button");
      modeVoiceBtn.type = "button";
      modeVoiceBtn.className = "mode-switch-btn active";
      modeVoiceBtn.setAttribute("aria-pressed", "true");
      modeVoiceBtn.textContent = "🎤 Microfono";

      const modeKeyboardBtn = document.createElement("button");
      modeKeyboardBtn.type = "button";
      modeKeyboardBtn.className = "mode-switch-btn";
      modeKeyboardBtn.setAttribute("aria-pressed", "false");
      modeKeyboardBtn.textContent = "⌨️ Tastiera (se usi Meet su telefono)";

      modeSwitch.append(modeVoiceBtn, modeKeyboardBtn);

      // Pannello voce
      const voicePanel = document.createElement("div");
      voicePanel.className = "voice-panel";

      const micControls = document.createElement("div");
      micControls.className = "recording-controls";
      const micBtn = document.createElement("button");
      micBtn.type = "button";
      micBtn.className = "btn-mic";
      micBtn.textContent = "🎤 Начать говорить · Parla col microfono";
      micBtn.disabled = true;

      micBtn.addEventListener("click", () => {
        if (recordingCardIndex === index) {
          stopSpeechRecognition(true);
        } else {
          startSpeechRecognition(index);
        }
      });
      micControls.appendChild(micBtn);

      const liveBox = document.createElement("div");
      liveBox.className = "live-transcript-box placeholder";
      liveBox.setAttribute("aria-live", "polite");
      liveBox.textContent = "Здесь появится распознанный текст...";

      voicePanel.append(micControls, liveBox);

      // Pannello tastiera alternativo
      const keyboardPanel = document.createElement("div");
      keyboardPanel.className = "keyboard-panel";
      keyboardPanel.hidden = true;

      const keyboardInput = document.createElement("textarea");
      keyboardInput.id = `keyboard-input-${index}`;
      keyboardInput.className = "answer-input";
      keyboardInput.rows = 4;
      keyboardInput.placeholder = "Scrivi qui o usa il microfono della tastiera del telefono...";
      keyboardInput.disabled = true;

      const accentToolbar = createItalianCharToolbar(keyboardInput, specialChars);

      keyboardInput.addEventListener("input", () => {
        scheduleDraftSync(index, keyboardInput.value);
      });

      const keyboardSubmitRow = document.createElement("div");
      keyboardSubmitRow.className = "keyboard-submit-row";
      const keyboardSubmitBtn = document.createElement("button");
      keyboardSubmitBtn.type = "button";
      keyboardSubmitBtn.className = "btn-submit-contribution";
      keyboardSubmitBtn.textContent = "Invia il contributo";
      keyboardSubmitBtn.disabled = true;

      keyboardSubmitBtn.addEventListener("click", async () => {
        keyboardSubmitBtn.disabled = true;
        await commitContribution(index, keyboardInput.value, "keyboard");
        keyboardSubmitBtn.disabled = !(sync && sync.canWrite(slotId));
      });
      keyboardSubmitRow.appendChild(keyboardSubmitBtn);
      keyboardPanel.append(accentToolbar, keyboardInput, keyboardSubmitRow);

      modeVoiceBtn.addEventListener("click", () => setKeyboardMode(index, false));
      modeKeyboardBtn.addEventListener("click", () => setKeyboardMode(index, true));

      const syncFeedback = document.createElement("div");
      syncFeedback.className = "sync-feedback";
      syncFeedback.setAttribute("role", "status");
      syncFeedback.setAttribute("aria-live", "polite");

      productionCard.append(prodHeader, modeSwitch, voicePanel, keyboardPanel, syncFeedback);

      // Contributi della sola scheda corrente (dal più vecchio al più recente)
      const contributionsWrapper = document.createElement("div");
      contributionsWrapper.className = "contributions-wrapper";
      const contributionsTitle = document.createElement("div");
      contributionsTitle.className = "contributions-title";
      contributionsTitle.textContent = "💬 Contributi registrati per questa scheda";
      const contributionsEmpty = document.createElement("p");
      contributionsEmpty.className = "contributions-empty";
      contributionsEmpty.textContent = "Nessun contributo registrato per questa scheda.";
      const contributionsList = document.createElement("div");
      contributionsList.className = "contributions-list";
      contributionsWrapper.append(contributionsTitle, contributionsEmpty, contributionsList);

      box.append(header);
      if (isTeacherView) box.append(assignmentBar);
      if (promptBlock) box.append(promptBlock);
      box.append(tipsDetails, productionCard, contributionsWrapper);
      questionsContainer.appendChild(box);

      cardUI.push({
        box,
        assignSelect,
        turnPill,
        productionCard,
        turnHintTag,
        modeSwitch,
        modeVoiceBtn,
        modeKeyboardBtn,
        voicePanel,
        micBtn,
        liveBox,
        keyboardPanel,
        accentToolbar,
        keyboardInput,
        keyboardSubmitBtn,
        syncFeedback,
        contributionsEmpty,
        contributionsList,
        isKeyboardMode: false
      });
    });

    if (isMultiCard && exerciseProgress) {
      cards.forEach((card, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "progress-step";
        button.textContent = String(index + 1);
        button.setAttribute("aria-label", `Vai alla scheda ${index + 1}: ${card.title}`);
        button.setAttribute("aria-current", index === activeCard ? "step" : "false");
        button.addEventListener("click", () => showCard(index));
        exerciseProgress.appendChild(button);
      });
    }

    function updateNavigation() {
      const last = activeCard === cards.length - 1;
      if (previousButton) previousButton.disabled = activeCard === 0;
      if (nextButton) nextButton.hidden = !isMultiCard || last;
      if (nextExerciseLink) nextExerciseLink.hidden = !last;
      if (navBar) navBar.hidden = !isMultiCard && (!nextExerciseLink || nextExerciseLink.hidden);

      if (isMultiCard && exerciseProgress) {
        exerciseProgress.querySelectorAll(".progress-step").forEach((button, index) => {
          const rawContributions = sync ? sync.read("contributions", slots[index].id) : null;
          const hasContribution = Boolean(rawContributions && Object.keys(rawContributions).length > 0);
          button.classList.toggle("done", hasContribution);
          button.setAttribute("aria-current", index === activeCard ? "step" : "false");
        });
      }

      if (progressText && isMultiCard) {
        progressText.textContent = `Scheda ${activeCard + 1} di ${cards.length}`;
      }
    }

    function showCard(index) {
      if (recordingCardIndex !== null && recordingCardIndex !== index) {
        stopSpeechRecognition(true);
      }
      activeCard = Math.max(0, Math.min(index, cards.length - 1));
            cardUI.forEach((ui, idx) => {
        ui.box.hidden = idx !== activeCard;
      });
      updateNavigation();
      notifyClassroomNotesScope(activeCard);
    }

    previousButton?.addEventListener("click", () => showCard(activeCard - 1));
    nextButton?.addEventListener("click", () => showCard(activeCard + 1));

    if (isMultiCard) {
      document.addEventListener("keydown", event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.target.closest("input, textarea, select, button, a, [tabindex]")) return;
        if (event.key === "ArrowLeft" && activeCard > 0) showCard(activeCard - 1);
        if (event.key === "ArrowRight" && activeCard < cards.length - 1) showCard(activeCard + 1);
      });
    }

    function renderCard(index, onlineSet) {
      const ui = cardUI[index];
      const slotId = slots[index].id;
      const assignee = sync ? sync.assignmentFor(slotId) : null;
      const canEdit = Boolean(sync && sync.canWrite(slotId));

      if (!canEdit && recordingCardIndex === index) {
        stopSpeechRecognition(true);
      }

      ui.turnPill.textContent = `🎤 Turno: ${formatAssigneeLabel(assignee, onlineSet)}`;
      ui.turnPill.classList.toggle("is-me", canEdit);

      ui.productionCard.classList.toggle("active-turn", canEdit);
      ui.turnHintTag.textContent = canEdit
        ? "È il tuo turno"
        : assignee
          ? `In turno: ${formatAssigneeLabel(assignee, onlineSet)}`
          : "In attesa di assegnazione";

      ui.modeSwitch.hidden = !canEdit;
      if (!canEdit && ui.isKeyboardMode) {
        setKeyboardMode(index, false);
      }

      ui.micBtn.disabled = !canEdit;
      ui.keyboardInput.disabled = !canEdit;
      ui.accentToolbar.querySelectorAll("button").forEach(btn => {
        btn.disabled = !canEdit;
      });
      ui.keyboardSubmitBtn.disabled = !canEdit;

      const remoteDraft = String((sync && sync.read("draft", slotId)) || "");
      if (recordingCardIndex !== index) {
        ui.liveBox.textContent = remoteDraft || "Здесь появится распознанный текст...";
        ui.liveBox.classList.toggle("placeholder", !remoteDraft);
      }
      if (!canEdit || document.activeElement !== ui.keyboardInput) {
        if (ui.keyboardInput.value !== remoteDraft) {
          ui.keyboardInput.value = remoteDraft;
        }
      }

      // Contributi della sola scheda corrente ordinati dal più vecchio al più recente
      const rawContributions = (sync && sync.read("contributions", slotId)) || {};
      const contributions = Object.entries(rawContributions)
        .map(([id, item]) => ({ id, ...(item || {}) }))
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      ui.contributionsList.replaceChildren();
      ui.contributionsEmpty.hidden = contributions.length > 0;

      contributions.forEach(item => {
        const card = document.createElement("article");
        card.className = "contribution-item";

        const body = document.createElement("div");
        body.className = "contribution-body";

        const textEl = document.createElement("p");
        textEl.className = "contribution-text";
        textEl.textContent = item.text || "";

        const metaEl = document.createElement("div");
        metaEl.className = "contribution-meta";
        const authorSpan = document.createElement("span");
        authorSpan.textContent = `👤 ${item.authorName || "Partecipante"}`;
        const modeSpan = document.createElement("span");
        modeSpan.textContent = item.inputMode === "keyboard" ? "⌨️ Tastiera" : "🎤 Voce";
        const timeSpan = document.createElement("span");
        timeSpan.textContent = `🕒 ${formatTimestamp(item.timestamp)}`;
        metaEl.append(authorSpan, modeSpan, timeSpan);

        body.append(textEl, metaEl);
        card.appendChild(body);
        ui.contributionsList.appendChild(card);
      });
    }

    function renderAllCards(onlineSet = new Set()) {
      cards.forEach((_, index) => renderCard(index, onlineSet));
      updateNavigation();
    }

    const db = window.ParloModes ? ParloModes.initFirebase() : null;
    if (!db) {
      setConnectionMessage("⚠️ Connessione al database non disponibile: verifica la rete o ricarica la pagina.");
    } else {
      const connectedRef = db.ref(".info/connected");
      connectedRef.on("value", snap => {
        if (snap.val() === false) {
          setConnectionMessage("⚠️ Connessione a Firebase interrotta: i salvataggi potrebbero non riuscire finché non torna la rete.");
        } else {
          setConnectionMessage("");
        }
      });

      const exerciseRef = db.ref(`esercizi/gruppi/${safeGroup}/${exercisePath}`);
      sync = ParloModes.createSync({
        mode: "multi-turn",
        ref: exerciseRef,
        database: db,
        session,
        slots,
        onChange(snapshotState) {
          renderAllCards(snapshotState.onlineStudents);
        },
        onError(error) {
          setConnectionMessage(`⚠️ Errore di sincronizzazione: ${error?.message || "controlla la connessione"}`);
          setCardFeedback(activeCard, "error", `⚠️ Errore: ${error?.message || "operazione non riuscita"}`);
        }
      });

      if (isTeacherView) {
        cardUI.forEach((ui, index) => {
          sync.bindAssignmentSelect(ui.assignSelect, slots[index].id);
        });
        ParloModes.loadGroupRoster(db, safeGroup, unitNumber, roster => {
          sync.setRoster(roster);
        });
      }
    }

    renderAllCards();
    showCard(0);

    if (window.ParloExercise) {
      ParloExercise.initBackgroundParallax?.();
      ParloExercise.decorateSessionLinks?.();
      ParloExercise.bindNavigationSelect?.(document.getElementById("exercise-menu"));
      ParloExercise.bindNavigationSelect?.(document.getElementById("grammar-menu"));
    }

    if (!document.querySelector('script[src*="classroom-notes.js"]')) {
      const notesScript = document.createElement("script");
      notesScript.src = "../classroom-notes.js";
      document.body.appendChild(notesScript);
    }

    return {
      showCard,
      getSync: () => sync
    };
  }

  window.ParloSpeechExercise = Object.freeze({
    init: initSpeechExercise
  });
})();