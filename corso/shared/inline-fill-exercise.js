/* Motore condiviso per esercizi con inserimento inline a schede, turni assegnati dall'insegnante,
   storico append-only dei contributi per scheda, correzione automatica e suggerimenti didattici. */
(() => {
  "use strict";

  const SPECIAL_CHARS = ["'", "à", "è", "ì", "ò", "ù", "È"];

  function bindMenuSafe(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    if (window.ParloExercise && typeof ParloExercise.bindNavigationSelect === "function") {
      ParloExercise.bindNavigationSelect(select);
      return;
    }
    select.addEventListener("change", event => {
      if (!event.target.value) return;
      const target = new URL(event.target.value, location.href);
      const params = new URLSearchParams(location.search);
      let sess = {};
      try { sess = JSON.parse(localStorage.getItem("parlo_session") || "{}"); } catch (_) {}
      const group = params.get("gruppo") || sess.group || "";
      const name = params.get("nome") || (!sess.isTeacher ? sess.name : "") || "";
      if (group) target.searchParams.set("gruppo", group);
      if (name && name !== "Insegnante") target.searchParams.set("nome", name);
      location.href = target.href;
    });
  }

  function formatAssigneeLabel(person, onlineSet) {
    if (!person) return "Nessuno";
    if (person.role === "teacher") return `👩‍🏫 ${person.name}`;
    const isOnline = onlineSet instanceof Set && onlineSet.has(person.name);
    return `${isOnline ? "🟢" : "⚪"} ${person.name}`;
  }

  function formatDateTime(ts) {
    const num = Number(ts);
    if (!Number.isFinite(num) || num <= 0) return "";
    try {
      return new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(num));
    } catch (_) {
      return new Date(num).toLocaleString("it-IT");
    }
  }

  function insertAtCursor(input, text) {
    if (!input || input.disabled) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const value = input.value;
    input.value = value.slice(0, start) + text + value.slice(end);
    const nextPos = start + text.length;
    input.focus();
    input.setSelectionRange(nextPos, nextPos);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function normalizeAnswer(str) {
    return String(str || "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[’`]/g, "'")
      .toLowerCase();
  }

  function isFieldCorrect(rawValue, expected) {
    const actual = normalizeAnswer(rawValue);
    if (!actual) return false;
    const allowed = Array.isArray(expected) ? expected : [expected];
    return allowed.some(ans => normalizeAnswer(ans) === actual);
  }

  function getHistoryList(rawHistory) {
    if (!rawHistory) return [];
    const items = Array.isArray(rawHistory)
      ? rawHistory.filter(Boolean)
      : Object.entries(rawHistory).map(([key, val]) => ({ _key: key, ...(val || {}) }));
    return items.sort((a, b) =>
      ((Number(a.timestamp) || 0) - (Number(b.timestamp) || 0)) ||
      String(a._key || "").localeCompare(String(b._key || ""))
    );
  }

  function initInlineFillExercise(config = {}) {
    bindMenuSafe("exercise-menu");
    bindMenuSafe("grammar-menu");
    if (window.ParloExercise) {
      ParloExercise.initBackgroundParallax?.();
      ParloExercise.decorateSessionLinks?.();
    }

    const unitNumber = Number(config.unitNumber || 1);
    const exercisePath = String(
      config.exercisePath ||
      location.pathname.split("/").pop().replace(/\.html$/i, "").replace(/[.#$\/\[\]]/g, "_") ||
      "es_inline_fill"
    );
    const sentences = Array.isArray(config.sentences) ? config.sentences : [];

    if (!sentences.length) {
      console.error("initInlineFillExercise: `sentences` è vuoto.");
      return null;
    }

        const session = window.ParloSession || {};
    const isTeacherView = Boolean(session.isTeacher);
    const isPersonalPractice = !isTeacherView && ["distance", "individual"].includes(session.activityMode);
    const safeGroup = session.safeGroup || "sconosciuto";
    const groupName = session.group || "";
    const myIdentityName = isTeacherView ? "Insegnante" : String(session.name || "").trim();

    const connectionBanner = document.getElementById("connection-banner");
        const exerciseProgress = document.getElementById("exercise-progress");
    exerciseProgress?.classList.add("inline-fill-progress");
    const questionsContainer = document.getElementById("questions-container");
    const previousButton = document.getElementById("previous-question");
    const nextButton = document.getElementById("next-question");
    const progressText = document.getElementById("question-progress");
    const nextExerciseLink = document.getElementById("next-exercise");

    if (!questionsContainer) {
      console.error("initInlineFillExercise: #questions-container non trovato nel DOM.");
      return null;
    }

    const slots = sentences.map((_, index) => ({
      id: `card_${index}`,
      label: `${index + 1}. Frase ${index + 1}`
    }));

    let db = null;
    let exerciseRef = null;
    let sync = null;
    let activeCard = 0;
    const cardUI = [];
    const saveTimers = new Map();
    const feedbackTimers = new Map();
    const dirtyFields = new Set();

    

    function safeRead(key, slotId) {
      try {
        return sync && typeof sync.read === "function" ? sync.read(key, slotId) : null;
      } catch (_) {
        return null;
      }
    }

    function safeCanWrite(slotId) {
      try {
        return Boolean(sync && typeof sync.canWrite === "function" && sync.canWrite(slotId));
      } catch (_) {
        return false;
      }
    }

    function safeAssignmentFor(slotId) {
      try {
        return sync && typeof sync.assignmentFor === "function" ? sync.assignmentFor(slotId) : null;
      } catch (_) {
        return null;
      }
    }

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

    function notifyClassroomNotesScope(index) {
      const sentence = sentences[index];
      const scopeKey = String(sentence?.id || `card_${index}`).replace(/[.#$\/\[\]]/g, "_");
      window.ParloNotesScope = {
        group: safeGroup,
        exercise: exercisePath,
        card: scopeKey,
        cardLabel: `Frase ${index + 1}`
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", {
        detail: window.ParloNotesScope
      }));
    }

    function getFieldValues(cardIndex) {
      const sentence = sentences[cardIndex];
      const slotId = slots[cardIndex].id;
      const remoteInputs = safeRead("inputs", slotId) || {};
      const result = {};
      sentence.parts.forEach(part => {
        if (!part || typeof part === "string" || !part.input) return;
        const uiInput = cardUI[cardIndex]?.inputsById?.[part.id]?.input;
        if (uiInput && (dirtyFields.has(`${cardIndex}_${part.id}`) || document.activeElement === uiInput)) {
          result[part.id] = uiInput.value;
        } else {
          result[part.id] = typeof remoteInputs[part.id] === "string" ? remoteInputs[part.id] : "";
        }
      });
      return result;
    }

    function buildRenderedText(sentence, values) {
      return sentence.parts.map(part => {
        if (typeof part === "string") {
          return part.replace(/<[^>]*>/g, "");
        }
        if (part && part.input) {
          const val = String(values?.[part.id] || "").trim();
          return `[${val || "___"}]`;
        }
        return "";
      }).join("");
    }

    async function persistField(cardIndex, fieldId, value) {
      const slotId = slots[cardIndex].id;
      const fieldKey = `${cardIndex}_${fieldId}`;
      if (!safeCanWrite(slotId)) {
        dirtyFields.delete(fieldKey);
        return;
      }

      setCardFeedback(cardIndex, "saving", "⏳ Salvataggio...");
      try {
        await sync.write(`inputs/${fieldId}`, value, slotId);
        await sync.write("checked", false, slotId);
        dirtyFields.delete(fieldKey);
        setCardFeedback(cardIndex, "saved", "✓ Salvato", 2000);
      } catch (error) {
        setCardFeedback(cardIndex, "error", `⚠️ Errore di salvataggio: ${error?.message || "riprova"}`);
      }
    }

    function scheduleFieldSave(cardIndex, fieldId, value) {
      const fieldKey = `${cardIndex}_${fieldId}`;
      dirtyFields.add(fieldKey);
      clearTimeout(saveTimers.get(fieldKey));
      setCardFeedback(cardIndex, "saving", "⏳ Salvataggio...");
      saveTimers.set(fieldKey, setTimeout(() => {
        saveTimers.delete(fieldKey);
        persistField(cardIndex, fieldId, value);
      }, 280));
    }

        async function flushCardSaves(cardIndex) {
      const sentence = sentences[cardIndex];
      const pendingSaves = [];
      sentence.parts.forEach(part => {
        if (!part || typeof part === "string" || !part.input) return;
        const fieldKey = `${cardIndex}_${part.id}`;
        if (saveTimers.has(fieldKey)) {
          clearTimeout(saveTimers.get(fieldKey));
          saveTimers.delete(fieldKey);
        }
        if (dirtyFields.has(fieldKey)) {
          const val = cardUI[cardIndex]?.inputsById?.[part.id]?.input?.value || "";
          pendingSaves.push(persistField(cardIndex, part.id, val));
        }
      });
      await Promise.all(pendingSaves);
    }

    async function appendContribution(cardIndex, authorName, submittedValues) {
      if (!sync || !authorName) throw new Error("Lo storico non è disponibile.");

      const sentence = sentences[cardIndex];
      const slotId = slots[cardIndex].id;
      const values = { ...submittedValues };
      const entry = {
        author: authorName,
        timestamp: Date.now(),
        inputs: values,
        renderedText: buildRenderedText(sentence, values)
      };

      await sync.push("history", entry, slotId);
    }

    questionsContainer.replaceChildren();
    if (exerciseProgress) exerciseProgress.replaceChildren();

    sentences.forEach((sentence, cardIndex) => {
      const box = document.createElement("div");
      box.className = "section-box";
      box.hidden = cardIndex !== activeCard;

      const header = document.createElement("div");
      header.className = "section-header";

      const title = document.createElement("div");
      title.className = "section-title";
      const numSpan = document.createElement("span");
      numSpan.className = "number";
      numSpan.textContent = String(cardIndex + 1);
      const textSpan = document.createElement("span");
      textSpan.textContent = `Frase ${cardIndex + 1} di ${sentences.length}`;
      title.append(numSpan, textSpan);

      const turnPill = document.createElement("span");
            turnPill.className = "turn-pill";
      turnPill.textContent = "✍️ Turno: Nessuno";
      turnPill.hidden = isPersonalPractice;
      header.append(title, turnPill);

      const assignmentBar = document.createElement("div");
            assignmentBar.className = "turn-assignment-bar";
      assignmentBar.hidden = !isTeacherView || isPersonalPractice;

      const assignLabel = document.createElement("label");
      assignLabel.htmlFor = `assign-turn-${cardIndex}`;
      assignLabel.textContent = "✍️ Assegna turno di lavoro:";

      const assignSelect = document.createElement("select");
      assignSelect.id = `assign-turn-${cardIndex}`;
      if (isTeacherView) {
        assignmentBar.append(assignLabel, assignSelect);
      }

      const worksheetCard = document.createElement("div");
      worksheetCard.className = "worksheet-card";

      const worksheetHeader = document.createElement("div");
      worksheetHeader.className = "worksheet-header";
      const worksheetLabel = document.createElement("span");
      worksheetLabel.className = "worksheet-label";
      worksheetLabel.textContent = "✏️ Completa negli spazi della frase:";
      const turnHintTag = document.createElement("span");
            turnHintTag.className = "turn-hint-tag";
      turnHintTag.textContent = "In attesa di assegnazione";
      turnHintTag.hidden = isPersonalPractice;
      worksheetHeader.append(worksheetLabel, turnHintTag);

      const accentToolbar = document.createElement("div");
      accentToolbar.className = "accent-toolbar";
      accentToolbar.setAttribute("aria-label", "Caratteri speciali italiani");

      let lastFocusedInput = null;
      const inputsById = {};
      const inputList = [];

      const accentButtons = SPECIAL_CHARS.map(ch => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = ch;
        btn.disabled = true;
        btn.setAttribute("aria-label", `Inserisci carattere ${ch}`);
        btn.addEventListener("mousedown", e => e.preventDefault());
        btn.addEventListener("click", () => {
          const target = (lastFocusedInput && !lastFocusedInput.disabled)
            ? lastFocusedInput
            : inputList.find(el => !el.disabled);
          insertAtCursor(target, ch);
        });
        accentToolbar.appendChild(btn);
        return btn;
      });

      const sentenceBox = document.createElement("p");
      sentenceBox.className = "sentence-content";

      let blankCounter = 0;
      sentence.parts.forEach(part => {
        if (typeof part === "string") {
          const span = document.createElement("span");
          span.innerHTML = part;
          sentenceBox.appendChild(span);
          return;
        }
        if (part && part.input) {
          blankCounter += 1;
          const wrap = document.createElement("span");
          wrap.className = "blank-wrap";

          const input = document.createElement("input");
          input.type = "text";
          input.className = "blank-input";
          input.autocomplete = "off";
          input.autocapitalize = "off";
                     input.spellcheck = false;
           input.placeholder = part.placeholder || "";
           input.disabled = true;
          input.setAttribute("aria-label", `Spazio ${blankCounter} nella frase ${cardIndex + 1}`);

          const mark = document.createElement("span");
          mark.className = "blank-mark";
          mark.setAttribute("aria-hidden", "true");

          input.addEventListener("focus", () => {
            lastFocusedInput = input;
          });
                    input.addEventListener("input", () => {
            scheduleFieldSave(cardIndex, part.id, input.value);
          });
          input.addEventListener("blur", () => {
            flushCardSaves(cardIndex);
          });

          wrap.append(input, mark);
          sentenceBox.appendChild(wrap);
          inputsById[part.id] = { input, wrap, mark, correct: part.correct };
          inputList.push(input);
        }
      });

      let hintsDetails = null;
      if (Array.isArray(sentence.hints) && sentence.hints.length > 0) {
        hintsDetails = document.createElement("details");
        hintsDetails.className = "hints-box";
        const summary = document.createElement("summary");
        summary.textContent = "💡 Suggerimenti";
        const ul = document.createElement("ul");
        ul.className = "hints-list";
                   ul.setAttribute("lang", sentence.hintsLang || "ru");
        sentence.hints.forEach(hintText => {
          const li = document.createElement("li");
          li.textContent = hintText;
          ul.appendChild(li);
        });
        hintsDetails.append(summary, ul);
      }

      const actionsRow = document.createElement("div");
      actionsRow.className = "actions-row";

      const checkBtn = document.createElement("button");
      checkBtn.type = "button";
            checkBtn.className = "btn-check";
      checkBtn.textContent = isPersonalPractice ? "✓ Invia le tue risposte" : "✓ Controlla le risposte";
      checkBtn.disabled = true;

      const syncFeedback = document.createElement("span");
      syncFeedback.className = "sync-feedback";
      syncFeedback.setAttribute("role", "status");
      syncFeedback.setAttribute("aria-live", "polite");

            actionsRow.append(checkBtn, syncFeedback);

      checkBtn.addEventListener("click", async () => {
        const slotId = slots[cardIndex].id;
        if (!safeCanWrite(slotId)) return;
        const submittedValues = getFieldValues(cardIndex);
        try {
          await flushCardSaves(cardIndex);
          await sync.write("checked", true, slotId);
          await appendContribution(cardIndex, myIdentityName || "Studente", submittedValues);
          setCardFeedback(cardIndex, "saved", isPersonalPractice
            ? "✓ Risposte salvate"
            : "✓ Contributo registrato", 2500);
        } catch (error) {
          setCardFeedback(cardIndex, "error", `⚠️ Errore di invio: ${error?.message || "riprova"}`);
        }
      });

      worksheetCard.append(worksheetHeader, accentToolbar, sentenceBox);
      if (hintsDetails) worksheetCard.appendChild(hintsDetails);
      worksheetCard.append(actionsRow);

      const historySection = document.createElement("div");
      historySection.className = "history-section";
      const historyTitle = document.createElement("h3");
            historyTitle.className = "history-title";
      historyTitle.textContent = isPersonalPractice
        ? `📜 Le tue risposte inviate · Frase ${cardIndex + 1}`
        : `📜 Contributi inviati · Frase ${cardIndex + 1}`;
      const historyList = document.createElement("div");
      historyList.className = "history-list";
      historySection.append(historyTitle, historyList);

      box.append(header);
      if (isTeacherView) box.append(assignmentBar);
      box.append(worksheetCard, historySection);
      questionsContainer.appendChild(box);

      cardUI.push({
        box,
        assignSelect,
        turnPill,
        worksheetCard,
        turnHintTag,
                accentButtons,
        inputsById,
        inputList,
        checkBtn,
        syncFeedback,
        historyList
      });
    });

    if (exerciseProgress) {
      sentences.forEach((_, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "progress-step";
        button.textContent = String(index + 1);
        button.setAttribute("aria-label", `Vai alla frase ${index + 1}`);
        button.setAttribute("aria-current", index === activeCard ? "step" : "false");
        button.addEventListener("click", () => showCard(index));
        exerciseProgress.appendChild(button);
      });
    }

    

    function renderHistory(cardIndex) {
      const ui = cardUI[cardIndex];
      const sentence = sentences[cardIndex];
      const slotId = slots[cardIndex].id;
      const rawHistory = safeRead("history", slotId);
      const items = getHistoryList(rawHistory);

      ui.historyList.replaceChildren();
      if (!items.length) {
        const empty = document.createElement("p");
                empty.className = "empty-message";
        empty.textContent = isPersonalPractice
          ? "Non hai ancora inviato risposte per questa frase."
          : "Nessun contributo registrato per questa frase.";
        ui.historyList.appendChild(empty);
        return;
      }

      items.forEach((item, idx) => {
        const card = document.createElement("article");
        card.className = "history-item";

        const meta = document.createElement("div");
        meta.className = "history-meta";
        const author = document.createElement("strong");
        author.textContent = `#${idx + 1} · 👤 ${item.author || "Partecipante"}`;
        const time = document.createElement("span");
        time.textContent = formatDateTime(item.timestamp);
        meta.append(author, time);

        const body = document.createElement("p");
        body.className = "history-sentence";
        sentence.parts.forEach(part => {
          if (typeof part === "string") {
            const span = document.createElement("span");
            span.innerHTML = part;
            body.appendChild(span);
          } else if (part && part.input) {
            const val = item.inputs?.[part.id] || "";
            const ok = isFieldCorrect(val, part.correct);
            const chip = document.createElement("span");
            chip.className = `history-blank ${val ? (ok ? "ok" : "err") : ""}`.trim();
            chip.textContent = val || "___";
            body.appendChild(chip);
          }
        });

        card.append(meta, body);
        ui.historyList.appendChild(card);
      });
    }

    function updateNavigation() {
      const last = activeCard === sentences.length - 1;
      if (previousButton) previousButton.disabled = activeCard === 0;
      if (nextButton) nextButton.hidden = last;
      if (nextExerciseLink) nextExerciseLink.hidden = !last;

      if (exerciseProgress) {
        exerciseProgress.querySelectorAll(".progress-step").forEach((button, index) => {
          const values = getFieldValues(index);
          const keys = Object.keys(values);
          const allFilled = keys.length > 0 && keys.every(k => String(values[k] || "").trim().length > 0);
          const historyItems = getHistoryList(safeRead("history", slots[index].id));
          button.classList.toggle("done", allFilled || historyItems.length > 0);
          button.setAttribute("aria-current", index === activeCard ? "step" : "false");
        });
      }

      if (progressText) {
        progressText.textContent = `Frase ${activeCard + 1} di ${sentences.length}`;
      }
    }

    function showCard(index) {
      activeCard = Math.max(0, Math.min(index, sentences.length - 1));
      cardUI.forEach((ui, idx) => {
        ui.box.hidden = idx !== activeCard;
      });
      updateNavigation();
      notifyClassroomNotesScope(activeCard);
    }

    previousButton?.addEventListener("click", () => showCard(activeCard - 1));
    nextButton?.addEventListener("click", () => showCard(activeCard + 1));

    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target.closest("input, textarea, select, button, a, summary, [tabindex]")) return;
      if (event.key === "ArrowLeft" && activeCard > 0) showCard(activeCard - 1);
      if (event.key === "ArrowRight" && activeCard < sentences.length - 1) showCard(activeCard + 1);
    });

    function renderCard(cardIndex, onlineSet) {
      const ui = cardUI[cardIndex];
      const sentence = sentences[cardIndex];
      const slotId = slots[cardIndex].id;
      const assignee = safeAssignmentFor(slotId);
      const canEdit = safeCanWrite(slotId);

      ui.turnPill.textContent = `✍️ Turno: ${formatAssigneeLabel(assignee, onlineSet)}`;
      ui.turnPill.classList.toggle("is-me", canEdit);

      ui.worksheetCard.classList.toggle("active-turn", canEdit);
      ui.turnHintTag.textContent = canEdit
        ? "È il tuo turno — completa gli spazi nella frase"
        : assignee
          ? `In turno: ${formatAssigneeLabel(assignee, onlineSet)}`
          : "In attesa di assegnazione";

            ui.accentButtons.forEach(btn => {
        btn.disabled = !canEdit;
      });

      const remoteInputs = safeRead("inputs", slotId) || {};

      sentence.parts.forEach(part => {
        if (!part || typeof part === "string" || !part.input) return;
        const entry = ui.inputsById[part.id];
        const fieldKey = `${cardIndex}_${part.id}`;
        entry.input.disabled = !canEdit;
        const remoteVal = typeof remoteInputs[part.id] === "string" ? remoteInputs[part.id] : "";
        if (!dirtyFields.has(fieldKey) && document.activeElement !== entry.input && entry.input.value !== remoteVal) {
          entry.input.value = remoteVal;
        }
      });

            ui.checkBtn.disabled = !canEdit;
      renderHistory(cardIndex);
    }

    let renderingCards = false;
    let rerenderQueued = false;
    let latestOnlineSet = new Set();

    function renderAllCards(onlineSet = new Set()) {
      latestOnlineSet = onlineSet;
      if (renderingCards) {
        rerenderQueued = true;
        return;
      }

      renderingCards = true;
      try {
        sentences.forEach((_, index) => {
          try {
            renderCard(index, latestOnlineSet);
          } catch (err) {
            console.error(`Errore rendering scheda ${index}:`, err);
          }
        });
        updateNavigation();
      } finally {
        renderingCards = false;
        if (rerenderQueued) {
          rerenderQueued = false;
          queueMicrotask(() => renderAllCards(latestOnlineSet));
        }
      }
    }


    function handlePageLeave() {
      sentences.forEach((_, index) => flushCardSaves(index));
    }
    window.addEventListener("pagehide", handlePageLeave);
    window.addEventListener("beforeunload", handlePageLeave);

    // Mostra subito la prima scheda prima ancora di connettere Firebase
    renderAllCards();
    showCard(0);

    const unitGate = document.querySelector(".unit-gate");
    const unlockNextUnitBtn = document.getElementById("unlock-unit-two");
    const nextUnitLink = document.getElementById("unit-two-link");
    const nextUnitStatus = document.getElementById("unit-two-status");
    const targetNextUnit = Number(config.nextUnitNumber || unitNumber + 1);
    const teacherCanUnlockNext = Boolean(isTeacherView && groupName && groupName !== "sconosciuto");

    if (unlockNextUnitBtn) {
      unlockNextUnitBtn.hidden = !teacherCanUnlockNext;
    }

    db = window.ParloModes ? ParloModes.initFirebase() : null;
    if (!db) {
      setConnectionMessage("⚠️ Connessione al database non disponibile: verifica la rete o ricarica la pagina.");
    } else {
      db.ref(".info/connected").on("value", snap => {
        if (snap.val() === false) {
          setConnectionMessage("⚠️ Connessione a Firebase interrotta: i salvataggi potrebbero non riuscire finché non torna la rete.");
        } else {
          setConnectionMessage("");
        }
      });

      exerciseRef = db.ref(`esercizi/gruppi/${safeGroup}/${exercisePath}`);
      sync = ParloModes.createSync({
        mode: "multi-turn",
        ref: exerciseRef,
        database: db,
        session,
        slots,
        onChange(snapshotState) {
          renderAllCards(snapshotState?.onlineStudents || new Set());
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

      if (unitGate && groupName && nextUnitLink && nextUnitStatus) {
        const groupConfigRef = db.ref(`configurazioneScuola/gruppi/${groupName}`);
        groupConfigRef.child("unitNumber").on("value", snapshot => {
          const currentUnit = Number(snapshot.val()) || 0;
          const unlocked = currentUnit >= targetNextUnit;
          nextUnitLink.setAttribute("aria-disabled", String(!unlocked));
          nextUnitLink.tabIndex = unlocked ? 0 : -1;
          if (unlockNextUnitBtn) {
            unlockNextUnitBtn.hidden = !teacherCanUnlockNext || unlocked;
          }
          nextUnitStatus.textContent = unlocked
            ? `Unità ${targetNextUnit} sbloccata per il gruppo.`
            : teacherCanUnlockNext
              ? `L’unità ${targetNextUnit} è bloccata per il gruppo.`
              : `Unità ${targetNextUnit} bloccata: attendi l’autorizzazione dell’insegnante.`;
        }, () => {
          nextUnitStatus.textContent = `Impossibile verificare lo sblocco dell’unità ${targetNextUnit}.`;
        });

                if (unlockNextUnitBtn) {
          unlockNextUnitBtn.addEventListener("click", async () => {
            if (!teacherCanUnlockNext) return;
            unlockNextUnitBtn.disabled = true;
            nextUnitStatus.textContent = "Salvataggio dello sblocco…";
            try {
              const result = await groupConfigRef.child("unitNumber").transaction(current => {
                const n = Number(current);
                return Number.isFinite(n) ? Math.max(n, targetNextUnit) : targetNextUnit;
              });
              if (!result.committed) throw new Error("Aggiornamento non completato");

              const unlockedUnit = Number(result.snapshot.val()) || targetNextUnit;
              await db.ref(`esercizi/gruppi/${safeGroup}/unitNumber`).transaction(current => {
                const n = Number(current);
                return Number.isFinite(n) ? Math.max(n, unlockedUnit) : unlockedUnit;
              });
              nextUnitStatus.textContent = `Unità ${targetNextUnit} sbloccata per il gruppo.`;
            } catch (_) {
              nextUnitStatus.textContent = `Errore: impossibile sbloccare l’unità ${targetNextUnit}.`;
            } finally {
              unlockNextUnitBtn.disabled = false;
            }
          });
        }
      }
    }

    return {
      showCard,
      getSync: () => sync
    };
  }

  window.ParloInlineFillExercise = Object.freeze({
    init: initInlineFillExercise
  });
})();