/* Motore condiviso per esercizi Vero/Falso a schede, turni e storico contributi. */
(() => {
  "use strict";

  function formatAssignee(person, onlineSet) {
    if (!person) return "Nessuno";
    if (person.role === "teacher") return `👩‍🏫 ${person.name}`;
    return `${onlineSet?.has(person.name) ? "🟢" : "⚪"} ${person.name}`;
  }

  function formatDate(timestamp) {
    const value = Number(timestamp);
    if (!value) return "Data non disponibile";
    return new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  }

  function init(config = {}) {
    const parts = Array.isArray(config.parts) ? config.parts : [];
    if (!parts.length) throw new Error("ParloVeroFalso.init richiede almeno una scheda in `parts`.");

    const session = window.ParloSession || {};
    const isTeacher = Boolean(session.isTeacher);
    const isPersonalPractice = !isTeacher && ["distance", "individual"].includes(session.activityMode);
    const safeGroup = session.safeGroup || "sconosciuto";
    const exercisePath = String(config.exercisePath || location.pathname.split("/").pop().replace(/\.html$/i, ""));
    const questionContainer = document.getElementById("questions-container");
    const progressNav = document.getElementById("exercise-progress");
    const connectionBanner = document.getElementById("connection-banner");
    const previousButton = document.getElementById("previous-question");
    const nextButton = document.getElementById("next-question");
    const nextExerciseLink = document.getElementById("next-exercise");
    const progressText = document.getElementById("question-progress");

    if (!questionContainer || !progressNav) throw new Error("Mancano i contenitori delle schede o dell’avanzamento.");

    const slots = parts.map((_, index) => ({ id: `card_${index}`, label: `${index + 1}. ${parts[index].title || `Dialogo ${index + 1}`}` }));
    const cards = [];
    const optimisticAnswers = new Map();
    let sync = null;
    let activeIndex = 0;
    let latestOnline = new Set();

    function showConnection(message) {
      if (!connectionBanner) return;
      connectionBanner.textContent = message || "";
      connectionBanner.hidden = !message;
    }

    function notifyNotes(index) {
      const part = parts[index];
      window.ParloNotesScope = {
        group: safeGroup,
        exercise: exercisePath,
        card: String(part.partId || `card_${index}`).replace(/[.#$\/\[\]]/g, "_"),
        cardLabel: part.title || `Dialogo ${index + 1}`
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", { detail: window.ParloNotesScope }));
    }

    function getAnswers(index) {
      const slot = slots[index].id;
      if (optimisticAnswers.has(slot)) return optimisticAnswers.get(slot);
      return sync?.read("answers", slot) || {};
    }

    function getHistory(index) {
      const raw = sync?.read("history", slots[index].id);
      const list = Array.isArray(raw) ? raw : Object.entries(raw || {}).map(([id, item]) => ({ ...item, _id: id }));
      return list.filter(Boolean).sort((a, b) => (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0));
    }

    function renderHistory(index) {
      const card = cards[index];
      const entries = getHistory(index);
      card.historyList.replaceChildren();
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "vf-empty";
        empty.textContent = isPersonalPractice ? "Non hai ancora inviato risposte per questo dialogo." : "Nessun contributo inviato per questo dialogo.";
        card.historyList.appendChild(empty);
        return;
      }
      entries.forEach((entry, itemIndex) => {
        const article = document.createElement("article");
        article.className = "vf-history-item";
        const meta = document.createElement("span");
        meta.className = "vf-history-meta";
        meta.textContent = `#${itemIndex + 1} · ${entry.author || "Partecipante"} · ${formatDate(entry.timestamp)}`;
        const answers = document.createElement("div");
        answers.className = "vf-history-answers";
        answers.textContent = parts[index].questions.map((question, qIndex) => `${qIndex + 1}) ${entry.answers?.[qIndex] || "—"}`).join(" · ");
        article.append(meta, answers);
        card.historyList.appendChild(article);
      });
    }

    function refreshCard(index) {
      const card = cards[index];
      const slotId = slots[index].id;
      const answers = getAnswers(index);
      const assignment = sync?.assignmentFor(slotId) || null;
      const canWrite = Boolean(sync?.canWrite(slotId));
      const isReadOnlyReview = Boolean(isTeacher && window.ParloReviewStudentId);
      card.turnPill.textContent = `✍️ Turno: ${formatAssignee(assignment, latestOnline)}`;
      card.turnPill.classList.toggle("is-me", canWrite);
      card.turnPill.hidden = isPersonalPractice;
      card.assignmentBar.hidden = !isTeacher;
      card.assignmentSelect.disabled = !isTeacher || isReadOnlyReview;
      card.worksheet.classList.toggle("active-turn", canWrite);
      card.turnHint.textContent = canWrite ? "È il tuo turno — scegli Vero o Falso" : assignment ? `In turno: ${formatAssignee(assignment, latestOnline)}` : "In attesa di assegnazione";
      card.turnHint.hidden = isPersonalPractice;

      let answered = 0;
      let correct = 0;
      parts[index].questions.forEach((question, qIndex) => {
        const row = card.rows[qIndex];
        const selected = String(answers[question.id] || "").toUpperCase();
        const valid = selected === "V" || selected === "F" ? selected : "";
        const isCorrect = Boolean(valid) && valid === question.correct;
        if (valid) answered += 1;
        if (isCorrect) correct += 1;
        row.element.classList.toggle("correct", isCorrect);
        row.element.classList.toggle("incorrect", Boolean(valid) && !isCorrect);
        row.mark.textContent = valid ? (isCorrect ? "✓" : "✕") : "";
        row.mark.className = `vf-mark${valid ? (isCorrect ? " correct" : " incorrect") : ""}`;
        row.buttonV.classList.toggle("selected", valid === "V");
        row.buttonF.classList.toggle("selected", valid === "F");
        row.buttonV.setAttribute("aria-pressed", String(valid === "V"));
        row.buttonF.setAttribute("aria-pressed", String(valid === "F"));
        row.buttonV.disabled = !canWrite;
        row.buttonF.disabled = !canWrite;
      });

      const total = parts[index].questions.length;
      card.feedback.className = `vf-feedback${answered === total && correct === total ? " correct" : answered ? " incorrect" : ""}`;
      card.feedback.textContent = answered
        ? `${correct === total ? "✓" : "✕"} ${correct} di ${total} risposte corrette${answered < total ? ` · ${total - answered} ancora da completare` : ""}.`
        : `Ascolta il dialogo e scegli V o F per ciascuna delle ${total} affermazioni.`;
      card.submit.disabled = !canWrite || answered === 0;
      renderHistory(index);
    }

    function refreshAll(onlineStudents = latestOnline) {
      latestOnline = onlineStudents instanceof Set ? onlineStudents : new Set();
      cards.forEach((_, index) => refreshCard(index));
      updateNavigation();
    }

    async function chooseAnswer(index, questionId, value) {
      if (!sync?.canWrite(slots[index].id)) return;
      const slotId = slots[index].id;
      const answers = { ...getAnswers(index) };
      answers[questionId] = String(answers[questionId] || "").toUpperCase() === value ? "" : value;
      optimisticAnswers.set(slotId, answers);
      refreshCard(index);
      try {
        await sync.write(`answers/${questionId}`, answers[questionId], slotId);
        optimisticAnswers.delete(slotId);
        refreshCard(index);
      } catch (error) {
        optimisticAnswers.delete(slotId);
        refreshCard(index);
        showConnection(`⚠️ Risposta non salvata: ${error?.message || "controlla la connessione"}`);
      }
    }

    async function submitAnswers(index) {
      const slotId = slots[index].id;
      if (!sync?.canWrite(slotId)) return;
      const answers = parts[index].questions.map(question => String(getAnswers(index)[question.id] || "").toUpperCase());
      if (!answers.some(Boolean)) return;
      cards[index].submit.disabled = true;
      try {
        await sync.push("history", {
          answers,
          author: sync.identity?.name || (isTeacher ? session.teacherName || "Insegnante" : "Studente"),
          timestamp: Date.now()
        }, slotId);
        cards[index].feedback.textContent = isPersonalPractice ? "✓ Risposte salvate nello storico." : "✓ Contributo aggiunto allo storico della scheda.";
      } catch (error) {
        showConnection(`⚠️ Contributo non inviato: ${error?.message || "controlla la connessione"}`);
      } finally {
        refreshCard(index);
      }
    }

    function updateNavigation() {
      parts.forEach((part, index) => {
        const step = progressNav.children[index];
        if (!step) return;
        const answers = getAnswers(index);
        const questions = part.questions;
        const answeredCount = questions.filter(question => {
          const answer = String(answers[question.id] || "").toUpperCase();
          return answer === "V" || answer === "F";
        }).length;
        const hasHistory = getHistory(index).length > 0;
        const isDone = answeredCount === questions.length || hasHistory;
        const isInProgress = answeredCount > 0 && !isDone;
        step.classList.toggle("done", isDone);
        step.classList.toggle("in-progress", isInProgress);
        step.setAttribute("aria-current", index === activeIndex ? "step" : "false");
        step.setAttribute("aria-label", `${part.title || `Dialogo ${index + 1}`}${isDone ? ", completato" : isInProgress ? ", in corso" : ", da iniziare"}`);
      });
      if (progressText) progressText.textContent = `Dialogo ${activeIndex + 1} di ${parts.length} · ${parts[activeIndex].title || ""}`;
      if (previousButton) previousButton.disabled = activeIndex === 0;
      if (nextButton) {
        nextButton.disabled = activeIndex === parts.length - 1;
        nextButton.hidden = activeIndex === parts.length - 1;
      }
      if (nextExerciseLink) nextExerciseLink.hidden = activeIndex !== parts.length - 1;
    }

    function navigate(index) {
      activeIndex = Math.max(0, Math.min(parts.length - 1, index));
      cards.forEach((card, cardIndex) => { card.box.hidden = cardIndex !== activeIndex; });
      cards.forEach((card, cardIndex) => {
        if (cardIndex !== activeIndex) {
          const audio = card.box.querySelector("audio");
          if (audio && !audio.paused) audio.pause();
        }
      });
      updateNavigation();
      notifyNotes(activeIndex);
    }

    function buildCard(part, index) {
      const box = document.createElement("article");
      box.className = "section-box vf-card";
      box.hidden = index !== 0;
      const header = document.createElement("header");
      header.className = "section-header";
      const title = document.createElement("div");
      title.className = "section-title";
      const number = document.createElement("span");
      number.className = "number";
      number.textContent = String(index + 1);
      const titleText = document.createElement("span");
      titleText.textContent = part.title || `Dialogo ${index + 1}`;
      title.append(number, titleText);
      const turnPill = document.createElement("span");
      turnPill.className = "turn-pill";
      turnPill.textContent = "✍️ Turno: Nessuno";
      header.append(title, turnPill);

      const assignmentBar = document.createElement("div");
      assignmentBar.className = "turn-assignment-bar";
      const label = document.createElement("label");
      const select = document.createElement("select");
      select.id = `vf-assign-turn-${index}`;
      label.htmlFor = select.id;
      label.textContent = "✍️ Assegna turno di lavoro:";
      assignmentBar.append(label, select);

      const worksheet = document.createElement("section");
      worksheet.className = "worksheet-card";
      const worksheetHeader = document.createElement("div");
      worksheetHeader.className = "worksheet-header";
      const instruction = document.createElement("span");
      instruction.className = "worksheet-label";
      instruction.textContent = "✏️ Scegli Vero o Falso per ogni affermazione:";
      const turnHint = document.createElement("span");
      turnHint.className = "turn-hint-tag";
      turnHint.textContent = "In attesa di assegnazione";
      worksheetHeader.append(instruction, turnHint);

      const media = document.createElement("div");
      media.className = "media-container";
      if (part.imgSrc) {
        const image = document.createElement("img");
        image.className = "slide-img";
        image.src = part.imgSrc;
        image.alt = part.imageAlt || part.title || `Immagine del dialogo ${index + 1}`;
        image.loading = "lazy";
        image.addEventListener("error", () => { image.hidden = true; }, { once: true });
        media.appendChild(image);
      }
      if (part.audioSrc) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "metadata";
        audio.src = part.audioSrc;
        audio.setAttribute("aria-label", `Audio: ${part.title || `Dialogo ${index + 1}`}`);
        media.appendChild(audio);
      }

      const list = document.createElement("div");
      list.className = "vf-list";
      const rows = [];
      part.questions.forEach(question => {
        const row = document.createElement("div");
        row.className = "vf-row";
        const statement = document.createElement("span");
        statement.className = "vf-statement";
        statement.textContent = question.text;
        const controls = document.createElement("div");
        controls.className = "vf-controls";
        const mark = document.createElement("span");
        mark.className = "vf-mark";
        mark.setAttribute("aria-hidden", "true");
        const buttons = document.createElement("div");
        buttons.className = "vf-buttons";
        const buttonV = document.createElement("button");
        buttonV.type = "button";
        buttonV.className = "btn-vf";
        buttonV.textContent = "V";
        buttonV.setAttribute("aria-label", `Vero: ${question.text}`);
        buttonV.addEventListener("click", () => chooseAnswer(index, question.id, "V"));
        const buttonF = document.createElement("button");
        buttonF.type = "button";
        buttonF.className = "btn-vf";
        buttonF.textContent = "F";
        buttonF.setAttribute("aria-label", `Falso: ${question.text}`);
        buttonF.addEventListener("click", () => chooseAnswer(index, question.id, "F"));
        buttons.append(buttonV, buttonF);
        controls.append(mark, buttons);
        row.append(statement, controls);
        list.appendChild(row);
        rows.push({ element: row, mark, buttonV, buttonF });
      });

      const feedback = document.createElement("p");
      feedback.className = "vf-feedback";
      feedback.setAttribute("role", "status");
      const submit = document.createElement("button");
      submit.type = "button";
      submit.className = "btn-vf-submit";
      submit.textContent = "📤 Invia il contributo";
      submit.addEventListener("click", () => submitAnswers(index));
      const history = document.createElement("section");
      history.className = "vf-history";
      const historyTitle = document.createElement("h3");
      historyTitle.textContent = "📋 Contributi inviati · Questo dialogo";
      const historyList = document.createElement("div");
      historyList.className = "vf-history-list";
      historyList.setAttribute("aria-live", "polite");
      history.append(historyTitle, historyList);

      worksheet.append(worksheetHeader, media, list, feedback, submit, history);
      box.append(header, assignmentBar, worksheet);
      questionContainer.appendChild(box);
      cards.push({ box, turnPill, assignmentBar, assignmentSelect: select, worksheet, turnHint, rows, feedback, submit, historyList });

      const step = document.createElement("button");
      step.type = "button";
      step.className = "progress-step";
      step.textContent = String(index + 1);
      step.setAttribute("aria-label", `Vai a ${part.title || `Dialogo ${index + 1}`}`);
      step.addEventListener("click", () => navigate(index));
      progressNav.appendChild(step);
    }

    questionContainer.replaceChildren();
    progressNav.replaceChildren();
    parts.forEach((part, index) => {
      if (!Array.isArray(part.questions) || !part.questions.length) throw new Error(`La scheda ${index + 1} non contiene domande.`);
      buildCard(part, index);
    });

    previousButton?.addEventListener("click", () => navigate(activeIndex - 1));
    nextButton?.addEventListener("click", () => navigate(activeIndex + 1));
    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input,textarea,select,button,a,audio,summary,[tabindex]")) return;
      if (event.key === "ArrowLeft") navigate(activeIndex - 1);
      if (event.key === "ArrowRight") navigate(activeIndex + 1);
    });

    if (window.ParloExercise) {
      ParloExercise.initBackgroundParallax?.();
      ParloExercise.decorateSessionLinks?.();
      ParloExercise.bindNavigationSelect?.(document.getElementById("exercise-menu"));
      ParloExercise.bindNavigationSelect?.(document.getElementById("grammar-menu"));
    }

    navigate(0);
    refreshAll();

    if (safeGroup === "sconosciuto" || !session.group) {
      showConnection("Accedi dalla pagina iniziale tramite il gruppo della classe per usare l’esercizio condiviso.");
      return { navigate };
    }

    const database = window.ParloModes?.initFirebase();
    if (!database) {
      showConnection("⚠️ Connessione al database non disponibile: verifica la rete o ricarica la pagina.");
      return { navigate };
    }

    database.ref(".info/connected").on("value", snapshot => {
      if (snapshot.val() === false) showConnection("⚠️ Connessione a Firebase interrotta: i salvataggi potrebbero non riuscire.");
      else showConnection("");
    });

    const exerciseRef = database.ref(`esercizi/gruppi/${safeGroup}/${exercisePath}`);
    sync = window.ParloModes.createSync({
      mode: "multi-turn",
      ref: exerciseRef,
      database,
      session,
      slots,
      onChange(state) { refreshAll(state?.onlineStudents || new Set()); },
      onError(error) { showConnection(`⚠️ Errore di sincronizzazione: ${error?.message || "controlla la connessione"}`); }
    });

    if (isTeacher) {
      cards.forEach((card, index) => sync.bindAssignmentSelect(card.assignmentSelect, slots[index].id));
      window.ParloModes.loadGroupRoster(database, safeGroup, Number(config.unitNumber || 0), roster => sync.setRoster(roster));
    }

    return { navigate, getSync: () => sync };
  }

  window.ParloVeroFalso = Object.freeze({ init });
})();
