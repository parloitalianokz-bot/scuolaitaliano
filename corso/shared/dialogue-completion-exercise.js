/* Motore condiviso per esercizi a schede separate con più campi di risposta per scheda e turni per scheda. */
(() => {
  "use strict";

  const SPECIAL_CHARS = ["à", "è", "é", "ì", "ò", "ù", "È"];

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

  function insertAtCursor(textarea, text) {
    if (!textarea || textarea.disabled) return;
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const value = textarea.value;
    textarea.value = value.slice(0, start) + text + value.slice(end);
    const nextPos = start + text.length;
    textarea.focus();
    textarea.setSelectionRange(nextPos, nextPos);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function initDialogueCompletionExercise(config = {}) {
    // Aggancia subito i menu e le utilità di pagina
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
      "es_dialogue_completion"
    );
    const dialogues = Array.isArray(config.dialogues) ? config.dialogues : [];

    if (!dialogues.length) {
      throw new Error("initDialogueCompletionExercise richiede almeno una scheda in `dialogues`.");
    }

        const session = window.ParloSession || {};
    const isTeacherView = Boolean(session.isTeacher);
    const isPersonalPractice = !isTeacherView && ["distance", "individual"].includes(session.activityMode);
    const safeGroup = session.safeGroup || "sconosciuto";

    const connectionBanner = document.getElementById("connection-banner");
    const exerciseProgress = document.getElementById("exercise-progress");
    const questionsContainer = document.getElementById("questions-container");
    const previousButton = document.getElementById("previous-question");
    const nextButton = document.getElementById("next-question");
    const progressText = document.getElementById("question-progress");
    const nextExerciseLink = document.getElementById("next-exercise");

    const slots = dialogues.map((dialogue, index) => ({
      id: `card_${index}`,
      label: `${index + 1}. ${dialogue.title}`
    }));

    let sync = null;
    let activeCard = 0;
    const cardUI = [];
    const saveTimers = new Map();
    const feedbackTimers = new Map();
    const dirtyFields = new Set();

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
      const dialogue = dialogues[index];
      const scopeKey = String(dialogue?.id || `card_${index}`).replace(/[.#$\/\[\]]/g, "_");
      window.ParloNotesScope = {
        group: safeGroup,
        exercise: exercisePath,
        card: scopeKey,
        cardLabel: dialogue?.title || `Scheda ${index + 1}`
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", {
        detail: window.ParloNotesScope
      }));
    }

    function getReplyValue(cardIndex, qIndex) {
      if (!sync) return "";
      const slotId = slots[cardIndex].id;
      const replies = sync.read("replies", slotId);
      if (Array.isArray(replies) && typeof replies[qIndex] === "string") {
        return replies[qIndex];
      }
      if (replies && typeof replies === "object" && typeof replies[String(qIndex)] === "string") {
        return replies[String(qIndex)];
      }
      return "";
    }

    async function persistField(cardIndex, qIndex, value) {
      const slotId = slots[cardIndex].id;
      const fieldKey = `${cardIndex}_${qIndex}`;
      if (!sync || !sync.canWrite(slotId)) {
        dirtyFields.delete(fieldKey);
        return;
      }

      setCardFeedback(cardIndex, "saving", "⏳ Salvataggio in corso...");
      try {
        await sync.write(`replies/${qIndex}`, value, slotId);
        dirtyFields.delete(fieldKey);
        setCardFeedback(cardIndex, "saved", "✓ Salvato", 2000);
      } catch (error) {
        setCardFeedback(cardIndex, "error", `⚠️ Errore di salvataggio: ${error?.message || "riprova"}`);
      }
    }

    function scheduleFieldSave(cardIndex, qIndex, value) {
      const fieldKey = `${cardIndex}_${qIndex}`;
      dirtyFields.add(fieldKey);
      clearTimeout(saveTimers.get(fieldKey));
      setCardFeedback(cardIndex, "saving", "⏳ Salvataggio...");
      saveTimers.set(fieldKey, setTimeout(() => {
        saveTimers.delete(fieldKey);
        persistField(cardIndex, qIndex, value);
      }, 320));
    }

    function flushFieldSave(cardIndex, qIndex, value) {
      const fieldKey = `${cardIndex}_${qIndex}`;
      if (saveTimers.has(fieldKey)) {
        clearTimeout(saveTimers.get(fieldKey));
        saveTimers.delete(fieldKey);
      }
      if (dirtyFields.has(fieldKey)) {
        persistField(cardIndex, qIndex, value);
      }
    }

    dialogues.forEach((dialogue, cardIndex) => {
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
      textSpan.textContent = dialogue.title;
      title.append(numSpan, textSpan);

            const turnPill = document.createElement("span");
      turnPill.className = "turn-pill";
      turnPill.textContent = "✍️ Turno: Nessuno";
      turnPill.hidden = isPersonalPractice;

      header.append(title, turnPill);

      const assignmentBar = document.createElement("div");
      assignmentBar.className = "turn-assignment-bar";
      assignmentBar.hidden = !isTeacherView;

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
      worksheetLabel.textContent = "💬 Battute da completare:";
            const turnHintTag = document.createElement("span");
      turnHintTag.className = "turn-hint-tag";
      turnHintTag.textContent = "In attesa di assegnazione";
      turnHintTag.hidden = isPersonalPractice;
      worksheetHeader.append(worksheetLabel, turnHintTag);

      const accentToolbar = document.createElement("div");
      accentToolbar.className = "accent-toolbar";
      accentToolbar.setAttribute("aria-label", "Caratteri speciali italiani");

      let lastFocusedTextarea = null;
      const accentButtons = SPECIAL_CHARS.map(ch => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = ch;
        btn.disabled = true;
        btn.setAttribute("aria-label", `Inserisci carattere ${ch}`);
        btn.addEventListener("mousedown", e => e.preventDefault());
        btn.addEventListener("click", () => {
          const targetTextarea = lastFocusedTextarea || textareas[0];
          insertAtCursor(targetTextarea, ch);
        });
        accentToolbar.appendChild(btn);
        return btn;
      });

            const turnsContainer = document.createElement("div");
      turnsContainer.className = dialogue.script
        ? "dialogue-turns-list dialogue-script"
        : "dialogue-turns-list";

      const textareas = dialogue.questions.map((question, qIndex) => {
        const promptLabel = document.createElement("label");
        promptLabel.className = dialogue.script ? "visually-hidden" : "prompt-question";
        const textareaId = `reply-${cardIndex}-${qIndex}`;
        promptLabel.htmlFor = textareaId;
        promptLabel.textContent = question.q;

        const textarea = document.createElement("textarea");
        textarea.id = textareaId;
        textarea.className = "student-reply";
        textarea.rows = 2;
        textarea.disabled = true;
                 textarea.placeholder = question.placeholder || "";
        if (question.questionMark) {
          const questionMark = document.createElement("span");
          questionMark.className = "dialogue-question-mark";
          questionMark.textContent = "?";
          textarea._questionMark = questionMark;
        }
        textarea.setAttribute("aria-label", `${dialogue.title}, risposta ${qIndex + 1}: ${question.q}`);

        textarea.addEventListener("focus", () => {
          lastFocusedTextarea = textarea;
        });
        textarea.addEventListener("input", () => {
          if (textarea._questionMark) textarea._questionMark.hidden = Boolean(textarea.value.trim());
          scheduleFieldSave(cardIndex, qIndex, textarea.value);
        });
        textarea.addEventListener("blur", () => {
          flushFieldSave(cardIndex, qIndex, textarea.value);
        });

        textarea._promptLabel = promptLabel;
        return textarea;
      });

      if (Array.isArray(dialogue.script)) {
        dialogue.script.forEach(turn => {
          const turnItem = document.createElement("div");
          turnItem.className = `dialogue-turn speaker-${turn.speaker === "agent" ? "agent" : "caller"}`;
          const bubble = document.createElement("div");
          bubble.className = "dialogue-line-bubble";

          if (Number.isInteger(turn.question) && textareas[turn.question]) {
            const textarea = textareas[turn.question];
            const dash = document.createElement("span");
            dash.className = "dialogue-dash";
            dash.textContent = "—";
            bubble.append(dash, textarea._promptLabel, textarea);
            if (textarea._questionMark) {
              textarea._questionMark.hidden = Boolean(textarea.value.trim());
              bubble.appendChild(textarea._questionMark);
            }
          } else {
            bubble.textContent = `— ${turn.text || ""}`;
          }

          turnItem.appendChild(bubble);
          turnsContainer.appendChild(turnItem);
        });
      } else {
        textareas.forEach((textarea, qIndex) => {
          const turnItem = document.createElement("div");
          turnItem.className = "dialogue-turn";
          turnItem.append(textarea._promptLabel, textarea);
          turnsContainer.appendChild(turnItem);
        });
      }

      const actionsRow = document.createElement("div");
      actionsRow.className = "actions-row";

      const syncFeedback = document.createElement("span");
      syncFeedback.className = "sync-feedback";
      syncFeedback.setAttribute("role", "status");
      syncFeedback.setAttribute("aria-live", "polite");
      actionsRow.appendChild(syncFeedback);

      worksheetCard.append(worksheetHeader, accentToolbar, turnsContainer, actionsRow);

      box.append(header);
      if (isTeacherView) box.append(assignmentBar);
      box.append(worksheetCard);
      questionsContainer.appendChild(box);

      cardUI.push({
        box,
        assignSelect,
        turnPill,
        worksheetCard,
        turnHintTag,
        accentButtons,
        textareas,
        syncFeedback
      });
    });

    dialogues.forEach((dialogue, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "progress-step";
      button.textContent = String(index + 1);
      button.setAttribute("aria-label", `Vai a ${dialogue.title}`);
      button.setAttribute("aria-current", index === activeCard ? "step" : "false");
      button.addEventListener("click", () => showCard(index));
      exerciseProgress.appendChild(button);
    });

    function updateNavigation() {
      const last = activeCard === dialogues.length - 1;
      previousButton.disabled = activeCard === 0;
      nextButton.hidden = last;
      if (nextExerciseLink) {
        nextExerciseLink.hidden = !last;
      }

      exerciseProgress.querySelectorAll(".progress-step").forEach((button, index) => {
        const count = dialogues[index].questions.length;
        let filledCount = 0;
        for (let q = 0; q < count; q++) {
          if (getReplyValue(index, q).trim().length > 0) filledCount++;
        }
        const isDone = count > 0 && filledCount === count;
        button.classList.toggle("done", isDone);
        button.setAttribute("aria-current", index === activeCard ? "step" : "false");
      });

      progressText.textContent = `Dialogo ${activeCard + 1} di ${dialogues.length}`;
    }

    function showCard(index) {
      activeCard = Math.max(0, Math.min(index, dialogues.length - 1));
      cardUI.forEach((ui, idx) => {
        ui.box.hidden = idx !== activeCard;
      });
      updateNavigation();
      notifyClassroomNotesScope(activeCard);
    }

    previousButton.addEventListener("click", () => showCard(activeCard - 1));
    nextButton.addEventListener("click", () => showCard(activeCard + 1));

    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target.closest("input, textarea, select, button, a, [tabindex]")) return;
      if (event.key === "ArrowLeft" && activeCard > 0) showCard(activeCard - 1);
      if (event.key === "ArrowRight" && activeCard < dialogues.length - 1) showCard(activeCard + 1);
    });

    function renderCard(cardIndex, onlineSet) {
      const ui = cardUI[cardIndex];
      const slotId = slots[cardIndex].id;
      const assignee = sync ? sync.assignmentFor(slotId) : null;
      const canEdit = Boolean(sync && sync.canWrite(slotId));

      ui.turnPill.textContent = `✍️ Turno: ${formatAssigneeLabel(assignee, onlineSet)}`;
      ui.turnPill.classList.toggle("is-me", canEdit);

      ui.worksheetCard.classList.toggle("active-turn", canEdit);
            ui.turnHintTag.textContent = canEdit
        ? (isPersonalPractice ? "Compila le battute della tua risposta" : "È il tuo turno — compila tutte le battute")
        : assignee
          ? `In turno: ${formatAssigneeLabel(assignee, onlineSet)}`
          : "In attesa di assegnazione";

      ui.accentButtons.forEach(btn => {
        btn.disabled = !canEdit;
      });

      ui.textareas.forEach((textarea, qIndex) => {
        const fieldKey = `${cardIndex}_${qIndex}`;
        const remoteVal = getReplyValue(cardIndex, qIndex);
        textarea.disabled = !canEdit;
        if (!dirtyFields.has(fieldKey) && document.activeElement !== textarea && textarea.value !== remoteVal) {
                     textarea.value = remoteVal;
           if (textarea._questionMark) textarea._questionMark.hidden = Boolean(remoteVal.trim());
         }
      });
    }

    function renderAllCards(onlineSet = new Set()) {
      dialogues.forEach((_, index) => renderCard(index, onlineSet));
      updateNavigation();
    }

    const db = window.ParloModes ? ParloModes.initFirebase() : null;
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

    return {
      showCard,
      getSync: () => sync
    };
  }

  window.ParloDialogueCompletionExercise = Object.freeze({
    init: initDialogueCompletionExercise
  });
})();