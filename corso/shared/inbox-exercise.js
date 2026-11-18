/* Motore condiviso per esercizi con inserimento inbox, turni per scheda e suggerimenti induttivi. */
(() => {
  "use strict";

  const DEFAULT_SPECIAL_CHARS = ["'", "à", "è", "ì", "ò", "ù", "È"];

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

  function initInboxExercise(config = {}) {
    const unitNumber = Number(config.unitNumber || 1);
    const exercisePath = String(
      config.exercisePath ||
      location.pathname.split("/").pop().replace(/\.html$/i, "").replace(/[.#$\/\[\]]/g, "_") ||
      "es_inbox"
    );
    const questions = Array.isArray(config.questions) ? config.questions : [];
    const specialChars = Array.isArray(config.specialChars) && config.specialChars.length
      ? config.specialChars
      : DEFAULT_SPECIAL_CHARS;
    const hintsLang = String(config.hintsLang || "ru");
    const placeholder = config.placeholder == null
      ? "Scrivi qui la risposta completa in italiano..."
      : String(config.placeholder);

    if (!questions.length) {
      throw new Error("initInboxExercise richiede almeno una domanda in `questions`.");
    }

        const session = window.ParloSession || {};
    const isTeacherView = Boolean(session.isTeacher);
    const isDistanceMode = session.activityMode === "distance";
    const isPersonalPractice = !isTeacherView && ["distance", "individual"].includes(session.activityMode);
    const safeGroup = session.safeGroup || "sconosciuto";
    const currentAuthorName = isTeacherView
      ? String(session.teacherName || session.name || "Insegnante").trim()
      : String(session.name || "").trim();

    const connectionBanner = document.getElementById("connection-banner");
    const questionsContainer = document.getElementById("questions-container");
    const previousButton = document.getElementById("previous-question");
    const nextButton = document.getElementById("next-question");
    const progressText = document.getElementById("question-progress");
    const exerciseProgress = document.getElementById("exercise-progress");
    const nextExerciseLink = document.getElementById("next-exercise");

    const questionTitle = (question, index) =>
      question.title || question.prompt || `${config.itemsLabel || "Scheda"} ${index + 1}`;
    const slots = questions.map((question, index) => ({
      id: `card_${index}`,
      label: `${index + 1}. ${questionTitle(question, index)}`
    }));

    let sync = null;
    let activeQuestion = 0;
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
      const question = questions[index];
      const scopeKey = String(question?.key || `card_${index}`).replace(/[.#$\/\[\]]/g, "_");
      window.ParloNotesScope = {
        group: safeGroup,
        exercise: exercisePath,
                card: scopeKey,
        reviewCard: slots[index].id,
        cardLabel: question?.title || `Scheda ${index + 1}`

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
      if (!sync) {
        setCardFeedback(index, "error", "⚠️ Connessione al database non disponibile: impossibile salvare.");
        return;
      }
      const slotId = slots[index].id;
      if (!sync.canWrite(slotId)) return;

      setCardFeedback(index, "saving", "⏳ Salvataggio in corso...");
      clearTimeout(draftTimers.get(index));
      draftTimers.set(index, setTimeout(() => {
        draftTimers.delete(index);
        if (!sync.canWrite(slotId)) return;
        sync.write("draft", text, slotId)
          .then(() => {
            setCardFeedback(index, "saved", "✓ Salvato", 2500);
          })
          .catch(error => {
            setCardFeedback(index, "error", `⚠️ Errore di salvataggio: ${error?.message || "riprova"}`);
          });
      }, 250));
    }

    questions.forEach((question, index) => {
      const slotId = slots[index].id;
      const box = document.createElement("div");
      box.className = "section-box";
      box.hidden = index !== activeQuestion;

      const header = document.createElement("div");
      header.className = "section-header";

      const title = document.createElement("div");
      title.className = "section-title";
      const numSpan = document.createElement("span");
      numSpan.className = "number";
      numSpan.textContent = String(index + 1);
      const textSpan = document.createElement("span");
      textSpan.textContent = questionTitle(question, index);
      title.append(numSpan, textSpan);

            const turnPill = document.createElement("span");
      turnPill.className = "turn-pill";
      turnPill.textContent = "✍️ Turno: Nessuno";
      turnPill.hidden = isPersonalPractice || isDistanceMode;

      header.append(title, turnPill);

      // Assegnazione turno (solo insegnante)
      const assignmentBar = document.createElement("div");
            assignmentBar.className = "turn-assignment-bar";
            assignmentBar.hidden = !isTeacherView || isPersonalPractice || isDistanceMode;


      const assignLabel = document.createElement("label");
      assignLabel.htmlFor = `assign-turn-${index}`;
      assignLabel.textContent = "✍️ Assegna turno di scrittura:";

      const assignSelect = document.createElement("select");
      assignSelect.id = `assign-turn-${index}`;
      if (isTeacherView) {
        assignmentBar.append(assignLabel, assignSelect);
      }

      // Suggerimenti didattici espandibili (facoltativi per singola scheda)
      const hints = Array.isArray(question.hints) ? question.hints : [];
      let hintsDetails = null;
      if (hints.length) {
        hintsDetails = document.createElement("details");
        hintsDetails.className = "didactic-hints";
        const hintsSummary = document.createElement("summary");
        hintsSummary.textContent = "💡 Suggerimenti";
        const hintsBody = document.createElement("div");
        hintsBody.className = "didactic-hints-body";
        if (hintsLang) hintsBody.lang = hintsLang;
        const hintsList = document.createElement("ul");
        hints.forEach(hintText => {
          const li = document.createElement("li");
          li.textContent = hintText;
          hintsList.appendChild(li);
        });
        hintsBody.appendChild(hintsList);
        hintsDetails.append(hintsSummary, hintsBody);
      }

      // Box condiviso
      const answerCard = document.createElement("div");
      answerCard.className = "answer-form-card";

      const answerHeader = document.createElement("div");
      answerHeader.className = "answer-form-header";
      const answerLabel = document.createElement("label");
            answerLabel.htmlFor = `answer-input-${index}`;
      answerLabel.textContent = isDistanceMode
        ? (isTeacherView ? "✍️ Risposta dello studente:" : "✍️ La tua risposta:")
        : isPersonalPractice ? "✍️ La tua risposta:" : "✍️ Risposta condivisa:";
      const turnHintTag = document.createElement("span");
      turnHintTag.className = "turn-hint-tag";
      turnHintTag.textContent = "In attesa di assegnazione";
            turnHintTag.hidden = isPersonalPractice || isDistanceMode;

      answerHeader.append(answerLabel, turnHintTag);

      const answerInput = document.createElement("textarea");
      answerInput.id = `answer-input-${index}`;
      answerInput.className = "answer-input";
      answerInput.rows = 3;
      answerInput.placeholder = question.placeholder == null ? placeholder : question.placeholder;
      answerInput.disabled = true;

      const accentToolbar = createItalianCharToolbar(answerInput, specialChars);
      const answerNote = document.createElement("p");
            answerNote.className = "answer-form-note";
            answerNote.textContent = isDistanceMode
        ? isTeacherView
          ? "Risposta dello studente, sincronizzata in tempo reale."
          : "La risposta viene salvata automaticamente e condivisa in tempo reale con l’insegnante."
        : config.liveDraftOnly
          ? "La risposta viene salvata e condivisa in tempo reale con l’insegnante."
          : isPersonalPractice
            ? session.activityMode === "individual"
              ? "Le tue risposte vengono salvate in uno spazio personale visibile solo a te."
              : "La risposta viene salvata nel tuo spazio personale per la revisione dell’insegnante."
            : "Dopo l’invio, la risposta comparirà nei contributi visibili al gruppo.";


      answerInput.addEventListener("input", () => {
        scheduleDraftSync(index, answerInput.value);
      });

      const submitRow = document.createElement("div");
      submitRow.className = "answer-submit-row";

      const syncFeedback = document.createElement("span");
      syncFeedback.className = "sync-feedback";
      syncFeedback.setAttribute("role", "status");
      syncFeedback.setAttribute("aria-live", "polite");

            const submitBtn = document.createElement("button");
      submitBtn.type = "button";
      submitBtn.className = "btn-submit-contribution";
      submitBtn.textContent = isPersonalPractice ? "Invia risposta" : (config.submitLabel || "Condividi risposta");
      submitBtn.disabled = true;

      submitBtn.addEventListener("click", async () => {
        if (!sync) {
          setCardFeedback(index, "error", "⚠️ Connessione al database non disponibile: impossibile inviare.");
          return;
        }
                if (!sync.canWrite(slotId)) {
          setCardFeedback(index, "error", isPersonalPractice
            ? "⚠️ Non puoi salvare la risposta in questo momento."
            : "⚠️ Non hai il turno di scrittura per questa scheda.");
          return;
        }
        const cleaned = answerInput.value.trim();
        if (!cleaned) {
          answerInput.focus();
          return;
        }
        clearTimeout(draftTimers.get(index));
        draftTimers.delete(index);

        submitBtn.disabled = true;
        setCardFeedback(index, "saving", "⏳ Salvataggio e invio in corso...");
        try {
          await sync.push("contributions", {
            questionKey: question.key || `q_${index + 1}`,
            text: cleaned,
            authorName: currentAuthorName || "Partecipante",
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }, slotId);
          await sync.write("draft", "", slotId);
          answerInput.value = "";
          setCardFeedback(index, "saved", isPersonalPractice
            ? "✓ Risposta salvata"
            : "✓ Contributo salvato e inviato", 3500);
          answerInput.focus();
        } catch (error) {
          setCardFeedback(index, "error", `⚠️ Errore durante l’invio: ${error?.message || "riprova"}`);
        } finally {
          submitBtn.disabled = !sync.canWrite(slotId);
        }
      });

            submitBtn.hidden = isDistanceMode || Boolean(config.liveDraftOnly);
      submitRow.append(syncFeedback, submitBtn);
      answerCard.append(answerHeader, accentToolbar, answerInput);
      if (!config.liveDraftOnly) answerCard.append(answerNote);
      answerCard.append(submitRow);


      // Contributi della scheda corrente
      const contributionsWrapper = document.createElement("div");
      contributionsWrapper.className = "contributions-wrapper";
      const contributionsTitle = document.createElement("div");
            contributionsTitle.className = "contributions-title";
      contributionsTitle.textContent = isPersonalPractice
        ? "💬 Le tue risposte inviate"
        : "💬 Contributi inviati per questa scheda";
      const contributionsEmpty = document.createElement("p");
      contributionsEmpty.className = "contributions-empty";
      contributionsEmpty.textContent = isPersonalPractice
        ? "Non hai ancora inviato risposte per questa scheda."
        : "Nessun contributo inviato per questa scheda.";
      const contributionsList = document.createElement("div");
      contributionsList.className = "contributions-list";
            contributionsWrapper.append(contributionsTitle, contributionsEmpty, contributionsList);
      contributionsWrapper.hidden = isDistanceMode || Boolean(config.liveDraftOnly);


      box.append(header);
      if (isTeacherView) box.append(assignmentBar);
      if (hintsDetails) box.append(hintsDetails);
      box.append(answerCard, contributionsWrapper);
      questionsContainer.appendChild(box);

      cardUI.push({
        box,
        assignSelect,
        turnPill,
        answerCard,
        turnHintTag,
        accentToolbar,
        answerInput,
        syncFeedback,
        submitBtn,
        contributionsEmpty,
        contributionsList
      });
    });

    // Barra di avanzamento navigabile
    questions.forEach((question, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "progress-step";
      button.textContent = String(index + 1);
      button.setAttribute("aria-label", `Vai alla scheda ${index + 1}: ${questionTitle(question, index)}`);
      button.setAttribute("aria-current", index === activeQuestion ? "step" : "false");
      button.addEventListener("click", () => showQuestion(index));
      exerciseProgress.appendChild(button);
    });

    function updateNavigation() {
      const last = activeQuestion === questions.length - 1;
      previousButton.disabled = activeQuestion === 0;
      nextButton.hidden = last;
      if (nextExerciseLink) {
        nextExerciseLink.hidden = !last;
      }

      exerciseProgress.querySelectorAll(".progress-step").forEach((button, index) => {
                const rawContributions = sync ? sync.read("contributions", slots[index].id) : null;
        const savedDraft = sync ? sync.read("draft", slots[index].id) : "";
        const hasContribution = isDistanceMode
          ? Boolean(String(savedDraft || "").trim())
          : Boolean(rawContributions && Object.keys(rawContributions).length > 0);
        button.classList.toggle("done", hasContribution);

        button.setAttribute("aria-current", index === activeQuestion ? "step" : "false");
      });

      progressText.textContent = `Scheda ${activeQuestion + 1} di ${questions.length}`;
    }

    function showQuestion(index) {
      activeQuestion = Math.max(0, Math.min(index, questions.length - 1));
      cardUI.forEach((ui, idx) => {
        ui.box.hidden = idx !== activeQuestion;
      });
      updateNavigation();
      notifyClassroomNotesScope(activeQuestion);
    }

    previousButton.addEventListener("click", () => showQuestion(activeQuestion - 1));
    nextButton.addEventListener("click", () => showQuestion(activeQuestion + 1));

    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target.closest("input, textarea, select, button, a, [tabindex]")) return;
      if (event.key === "ArrowLeft" && activeQuestion > 0) showQuestion(activeQuestion - 1);
      if (event.key === "ArrowRight" && activeQuestion < questions.length - 1) showQuestion(activeQuestion + 1);
    });

    function renderCard(index, onlineSet) {
      const ui = cardUI[index];
      const slotId = slots[index].id;
      const assignee = sync ? sync.assignmentFor(slotId) : null;
      const canEdit = Boolean(sync && sync.canWrite(slotId));

      ui.turnPill.textContent = `✍️ Turno: ${formatAssigneeLabel(assignee, onlineSet)}`;
      ui.turnPill.classList.toggle("is-me", canEdit);

      ui.answerCard.classList.toggle("active-turn", canEdit);
      ui.turnHintTag.textContent = canEdit
        ? "È il tuo turno di scrivere"
        : assignee
          ? `In turno: ${formatAssigneeLabel(assignee, onlineSet)}`
          : "In attesa di assegnazione";

      const remoteDraft = (sync && sync.read("draft", slotId)) || "";
      if (!canEdit || document.activeElement !== ui.answerInput) {
        if (ui.answerInput.value !== remoteDraft) {
          ui.answerInput.value = remoteDraft;
        }
      }
            ui.answerInput.readOnly = isDistanceMode && isTeacherView;
      ui.answerInput.disabled = isDistanceMode ? false : !canEdit;
      ui.accentToolbar.querySelectorAll("button").forEach(btn => {
        btn.disabled = !canEdit || (isDistanceMode && isTeacherView);
      });

      ui.submitBtn.disabled = !canEdit;

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
        const timeSpan = document.createElement("span");
        timeSpan.textContent = `🕒 ${formatTimestamp(item.timestamp)}`;
        metaEl.append(authorSpan, timeSpan);

        body.append(textEl, metaEl);
        card.appendChild(body);
        ui.contributionsList.appendChild(card);
      });
    }

    function renderAllCards(onlineSet = new Set()) {
      questions.forEach((_, index) => renderCard(index, onlineSet));
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
          setCardFeedback(activeQuestion, "error", `⚠️ Errore: ${error?.message || "operazione non riuscita"}`);
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
    showQuestion(0);

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
      showQuestion,
      getSync: () => sync
    };
  }

  window.ParloInboxExercise = Object.freeze({
    init: initInboxExercise
  });
})();