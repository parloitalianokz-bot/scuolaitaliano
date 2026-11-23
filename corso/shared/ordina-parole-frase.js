/* Motore condiviso per comporre frasi cliccando le parole. */
(() => {
  "use strict";

  function normalizeWord(value) {
    return String(value ?? "").trim().toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function formatAssigneeLabel(person, onlineSet) {
    if (!person) return "Nessuno";
    if (person.role === "teacher") return `👩‍🏫 ${person.name}`;
    return `${onlineSet instanceof Set && onlineSet.has(person.name) ? "🟢" : "⚪"} ${person.name}`;
  }

  function initWordOrderExercise(config = {}) {
    const sentences = Array.isArray(config.sentences) ? config.sentences : [];
    if (!sentences.length) throw new Error("initWordOrderExercise richiede almeno una frase in `sentences`.");

    const unitNumber = Number(config.unitNumber || 1);
    const exercisePath = String(config.exercisePath || location.pathname.split("/").pop().replace(/\.html$/i, "").replace(/[.#$\/\[\]]/g, "_") || "ordina_parole_frase");
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
    const slots = sentences.map((sentence, index) => ({ id: `frase_${index + 1}`, label: `${index + 1}. ${sentence.title}` }));
    let sync = null;
    let activeCard = 0;
    const cardUI = [];
    const feedbackTimers = new Map();

    function setConnectionMessage(message) {
      if (!connectionBanner) return;
      connectionBanner.textContent = message || "";
      connectionBanner.hidden = !message;
    }

    function setCardFeedback(index, type, message, autoClearMs = 0) {
      const ui = cardUI[index];
      if (!ui) return;
      clearTimeout(feedbackTimers.get(index));
      feedbackTimers.delete(index);
      ui.feedback.className = `sync-feedback ${type || ""}`.trim();
      ui.feedback.textContent = message || "";
      if (autoClearMs && message) {
        feedbackTimers.set(index, setTimeout(() => {
          feedbackTimers.delete(index);
          ui.feedback.className = "sync-feedback";
          ui.feedback.textContent = "";
        }, autoClearMs));
      }
    }

    function getState(index) {
      const slotId = slots[index].id;
      const raw = sync ? sync.read("state", slotId) : null;
      const order = Array.isArray(raw?.order) ? raw.order : [];
      const valid = [];
      order.forEach(token => {
        if (Number.isInteger(token) && token >= 0 && token < sentences[index].words.length && !valid.includes(token)) valid.push(token);
      });
      return { order: valid, verified: Boolean(raw?.verified) };
    }

    function correctTokenOrder(sentence) {
      const words = sentence.words;
      const available = new Map();
      words.forEach((word, index) => {
        const key = normalizeWord(word);
        if (!available.has(key)) available.set(key, []);
        available.get(key).push(index);
      });
      return (sentence.correctOrder || []).map(word => available.get(normalizeWord(word))?.shift()).filter(Number.isInteger);
    }

    function makeButton(label, className, disabled, onClick, ariaLabel) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.textContent = label;
      button.disabled = disabled;
      if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
      button.addEventListener("click", onClick);
      return button;
    }

    sentences.forEach((sentence, index) => {
      const box = document.createElement("div");
      box.className = "section-box";
      box.hidden = index !== activeCard;

      const header = document.createElement("div");
      header.className = "section-header";
      const title = document.createElement("div");
      title.className = "section-title";
      const number = document.createElement("span");
      number.className = "number";
      number.textContent = String(index + 1);
      const titleText = document.createElement("span");
      titleText.textContent = sentence.title;
      title.append(number, titleText);
      const turnPill = document.createElement("span");
      turnPill.className = "turn-pill";
      header.append(title, turnPill);

      const assignmentBar = document.createElement("div");
      assignmentBar.className = "turn-assignment-bar";
      assignmentBar.hidden = !isTeacherView;
      const assignLabel = document.createElement("label");
      assignLabel.htmlFor = `assign-turn-${index}`;
      assignLabel.textContent = "✍️ Assegna turno di lavoro:";
      const assignSelect = document.createElement("select");
      assignSelect.id = `assign-turn-${index}`;
      if (isTeacherView) assignmentBar.append(assignLabel, assignSelect);

      const worksheet = document.createElement("div");
      worksheet.className = "worksheet-card";
      const worksheetHeader = document.createElement("div");
      worksheetHeader.className = "worksheet-header";
      const worksheetLabel = document.createElement("span");
      worksheetLabel.className = "worksheet-label";
      worksheetLabel.textContent = "🧩 Componi la frase:";
      const turnHint = document.createElement("span");
      turnHint.className = "turn-hint-tag";
      worksheetHeader.append(worksheetLabel, turnHint);

      const subject = document.createElement("p");
      subject.className = "word-order-subject";
      subject.textContent = sentence.subject;
      const answerLabel = document.createElement("strong");
      answerLabel.className = "word-order-label";
      answerLabel.textContent = "La tua frase";
      const answerBox = document.createElement("div");
      answerBox.className = "word-order-answer";
      answerBox.setAttribute("aria-label", "Parole inserite nella frase");
      answerBox.setAttribute("aria-live", "polite");
      const bankLabel = document.createElement("strong");
      bankLabel.className = "word-order-label";
      bankLabel.textContent = "Parole disponibili — clicca per inserirle:";
      const bank = document.createElement("div");
      bank.className = "word-order-bank";
      const hint = document.createElement("p");
      hint.className = "word-order-hint";
      hint.textContent = sentence.hint || "Clicca una parola per inserirla; cliccala nella frase per rimetterla tra le parole disponibili.";

      const actions = document.createElement("div");
      actions.className = "actions-row";
      const feedback = document.createElement("span");
      feedback.className = "sync-feedback";
      feedback.setAttribute("role", "status");
      feedback.setAttribute("aria-live", "polite");
      const verifyButton = document.createElement("button");
      verifyButton.type = "button";
      verifyButton.className = "btn-verify";
      verifyButton.textContent = "✅ Verifica la frase";
      const summary = document.createElement("p");
      summary.className = "automatic-score";
      summary.hidden = true;
      actions.append(feedback, verifyButton);
      worksheet.append(worksheetHeader, subject, answerLabel, answerBox, bankLabel, bank, hint, actions, summary);
      box.append(header);
      if (isTeacherView) box.append(assignmentBar);
      box.append(worksheet);
      questionsContainer.appendChild(box);

      cardUI.push({ box, turnPill, assignmentBar, assignSelect, worksheet, turnHint, subject, answerBox, bank, feedback, verifyButton, summary });
    });

    sentences.forEach((sentence, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "progress-step";
      button.textContent = String(index + 1);
      button.setAttribute("aria-label", `Vai a ${sentence.title}`);
      button.setAttribute("aria-current", index === activeCard ? "step" : "false");
      button.addEventListener("click", () => showCard(index));
      exerciseProgress.appendChild(button);
    });

    function updateNavigation() {
      const last = activeCard === sentences.length - 1;
      previousButton.disabled = activeCard === 0;
      nextButton.hidden = last;
      if (nextExerciseLink) nextExerciseLink.hidden = !last;
      exerciseProgress.querySelectorAll(".progress-step").forEach((button, index) => {
        button.classList.toggle("done", getState(index).verified);
        button.setAttribute("aria-current", index === activeCard ? "step" : "false");
      });
      progressText.textContent = `Frase ${activeCard + 1} di ${sentences.length}`;
    }

    function notifyNotesScope(index) {
      const sentence = sentences[index];
      window.ParloNotesScope = {
        group: safeGroup,
        exercise: exercisePath,
        card: String(sentence.id || slots[index].id).replace(/[.#$\/\[\]]/g, "_"),
        cardLabel: sentence.title || `Frase ${index + 1}`
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", { detail: window.ParloNotesScope }));
    }

    function showCard(index) {
      activeCard = Math.max(0, Math.min(index, sentences.length - 1));
      cardUI.forEach((ui, cardIndex) => { ui.box.hidden = cardIndex !== activeCard; });
      updateNavigation();
      notifyNotesScope(activeCard);
    }

    previousButton.addEventListener("click", () => showCard(activeCard - 1));
    nextButton.addEventListener("click", () => showCard(activeCard + 1));
    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input, textarea, select, button, a, [tabindex]")) return;
      if (event.key === "ArrowLeft" && activeCard > 0) showCard(activeCard - 1);
      if (event.key === "ArrowRight" && activeCard < sentences.length - 1) showCard(activeCard + 1);
    });

    async function saveState(index, nextState) {
      const slotId = slots[index].id;
      if (!sync || !sync.canWrite(slotId)) return;
      setCardFeedback(index, "saving", "⏳ Salvataggio in corso...");
      renderCard(index, new Set(), nextState);
      try {
        await sync.write("state", nextState, slotId);
        setCardFeedback(index, "saved", "✓ Salvato", 1800);
      } catch (error) {
        setCardFeedback(index, "error", `⚠️ Errore di salvataggio: ${error?.message || "riprova"}`);
        renderCard(index);
      }
    }

    function renderCard(index, onlineSet = new Set(), stateOverride = null) {
      const ui = cardUI[index];
      const sentence = sentences[index];
      const slotId = slots[index].id;
      const assignee = sync ? sync.assignmentFor(slotId) : null;
      const canEdit = Boolean(sync && sync.canWrite(slotId));
      const state = stateOverride || getState(index);
      const correctOrder = correctTokenOrder(sentence);
      const isVerified = state.verified;
      const selected = new Set(state.order);
      let correctCount = 0;

      ui.turnPill.textContent = `✍️ Turno: ${formatAssigneeLabel(assignee, onlineSet)}`;
      ui.turnPill.classList.toggle("is-me", canEdit);
      ui.worksheet.classList.toggle("active-turn", canEdit);
      ui.turnHint.textContent = canEdit
        ? (isPersonalPractice ? "Puoi comporre la frase" : "È il tuo turno")
        : assignee ? `In turno: ${formatAssigneeLabel(assignee, onlineSet)}` : "In attesa di assegnazione";

      ui.answerBox.replaceChildren();
      const fixedSubject = document.createElement("span");
      fixedSubject.className = "word-order-fixed";
      fixedSubject.textContent = sentence.subject;
      ui.answerBox.appendChild(fixedSubject);
      state.order.forEach((tokenIndex, position) => {
        const word = sentence.words[tokenIndex];
        const isCorrect = isVerified && correctOrder[position] === tokenIndex;
        if (isCorrect) correctCount++;
        ui.answerBox.appendChild(makeButton(word, `word-order-token in-answer${isVerified ? (isCorrect ? " is-correct" : " is-incorrect") : ""}`, !canEdit, () => {
          const nextOrder = state.order.filter(value => value !== tokenIndex);
          saveState(index, { order: nextOrder, verified: false });
        }, `Rimetti «${word}» tra le parole disponibili`));
      });
      ui.bank.replaceChildren();
      sentence.words.forEach((word, tokenIndex) => {
        if (selected.has(tokenIndex)) return;
        ui.bank.appendChild(makeButton(word, "word-order-token", !canEdit, () => {
          saveState(index, { order: [...state.order, tokenIndex], verified: false });
        }, `Inserisci «${word}» nella frase`));
      });
      const complete = state.order.length === sentence.words.length;
      ui.verifyButton.disabled = !canEdit || !complete;
      ui.verifyButton.onclick = async () => {
        if (!sync || !sync.canWrite(slotId) || !complete) return;
        try {
          await sync.write("state", { order: state.order, verified: true }, slotId);
          setCardFeedback(index, "saved", "✓ Frase verificata", 2500);
        } catch (error) {
          setCardFeedback(index, "error", `⚠️ Errore durante la verifica: ${error?.message || "riprova"}`);
        }
      };
      if (isVerified) {
        ui.summary.textContent = `Correzione automatica: ${correctCount} di ${sentence.words.length} parole al posto giusto`;
        ui.summary.hidden = false;
      } else {
        ui.summary.hidden = true;
      }
    }

    function renderAllCards(onlineSet = new Set()) {
      sentences.forEach((_, index) => renderCard(index, onlineSet));
      updateNavigation();
    }

    const db = window.ParloModes ? ParloModes.initFirebase() : null;
    if (!db) {
      setConnectionMessage("⚠️ Connessione al database non disponibile: verifica la rete o ricarica la pagina.");
    } else {
      db.ref(".info/connected").on("value", snapshot => {
        setConnectionMessage(snapshot.val() === false
          ? "⚠️ Connessione a Firebase interrotta: i salvataggi potrebbero non riuscire finché non torna la rete."
          : "");
      });
      const exerciseRef = db.ref(`esercizi/gruppi/${safeGroup}/${exercisePath}`);
      sync = ParloModes.createSync({
        mode: "multi-turn",
        ref: exerciseRef,
        database: db,
        session,
        slots,
        onChange(snapshotState) { renderAllCards(snapshotState.onlineStudents); },
        onError(error) {
          setConnectionMessage(`⚠️ Errore di sincronizzazione: ${error?.message || "controlla la connessione"}`);
          setCardFeedback(activeCard, "error", `⚠️ Errore: ${error?.message || "operazione non riuscita"}`);
        }
      });
      if (isTeacherView) {
        cardUI.forEach((ui, index) => sync.bindAssignmentSelect(ui.assignSelect, slots[index].id));
        ParloModes.loadGroupRoster(db, safeGroup, unitNumber, roster => sync.setRoster(roster));
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
    return { showCard, getSync: () => sync };
  }

  window.ParloWordOrderExercise = Object.freeze({ init: initWordOrderExercise });
})();
