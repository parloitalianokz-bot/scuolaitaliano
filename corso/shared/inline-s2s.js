/* Motore condiviso per dialoghi inline con turni distinti per Personaggio A e B. */
(() => {
  "use strict";

  const SPECIAL_CHARS = ["'", "à", "è", "ì", "ò", "ù", "È"];

  function normalizeAnswer(value) {
    return String(value || "").toLocaleLowerCase("it")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, "").trim();
  }

  function init(config = {}) {
    const dialogues = Array.isArray(config.dialogues) ? config.dialogues : [];
    if (!dialogues.length) throw new Error("ParloInlineS2S.init richiede almeno un dialogo.");

    const session = window.ParloSession || {};
    const isTeacher = Boolean(session.isTeacher);
    const activityMode = ["online", "distance", "individual"].includes(session.activityMode) ? session.activityMode : "online";
    const independent = activityMode !== "online";
    const uniqueAssignments = config.uniqueAssignments !== false;
    const validateAnswers = config.validateAnswers !== false;
    const group = String(session.group || "").trim();
    const safeGroup = String(session.safeGroup || "sconosciuto");
    const userName = String(isTeacher ? (session.teacherName || session.name || "Insegnante") : (session.name || ""));
    const roleSlots = { A: "personaggio-a", B: "personaggio-b" };
    const slots = Object.entries(roleSlots).map(([role, id]) => ({ id, label: `Personaggio ${role}` }));
    const cards = [];
    const timers = new Map();
    let sync = null;
    let active = 0;
    let writerA = null;
    let writerB = null;
    let answers = Object.fromEntries(dialogues.map(dialogue => [dialogue.id, new Array(dialogue.keys.length).fill("")]));
    let applyingSnapshot = false;
    let lastActiveInput = null;

    const el = id => document.getElementById(id);
    const teacherControls = el("teacher-controls");
    const writerASelect = el("writer-a-select");
    const writerBSelect = el("writer-b-select");
    const assignmentStatus = el("assignment-status");
    const statusMessage = el("status-message");
    const badge = el("user-badge");
    const toolbar = el("char-toolbar");
    const container = el("questions-container");
    const progress = el("exercise-progress");
    const progressFill = el("progress-fill");
    const previous = el("previous-question");
    const next = el("next-question");
    const progressText = el("question-progress");
    const nextExercise = el("next-exercise");
    const modeNote = el("mode-note");

    if (!container || !progress) throw new Error("Mancano i contenitori dell’esercizio inline-s2s.");

    const setStatus = (message, error = false) => {
      if (!statusMessage) return;
      statusMessage.textContent = message || "";
      statusMessage.classList.toggle("error", Boolean(error));
    };
    const slotFor = role => roleSlots[role];
    const canWriteRole = role => Boolean(sync?.canWrite(slotFor(role)));
    const canWriteAny = () => canWriteRole("A") || canWriteRole("B");
    const readRoleAnswers = (dialogue, role) => sync?.read(`answers/${dialogue.id}`, slotFor(role)) || {};
    const currentIdentity = () => sync?.identity || (userName ? { role: isTeacher ? "teacher" : "student", name: userName } : null);

    if (window.ParloExercise) {
      ParloExercise.initBackgroundParallax?.();
      ParloExercise.decorateSessionLinks?.();
      ParloExercise.bindNavigationSelect?.(el("exercise-menu"));
      ParloExercise.bindNavigationSelect?.(el("grammar-menu"));
    }

    const descriptions = {
      online: isTeacher
        ? "💬 Modalità online: assegna Personaggio A e B; dialoghi e contributi sono condivisi in tempo reale."
        : "💬 Modalità online: completa le battute del personaggio assegnato; il dialogo si aggiorna in tempo reale.",
      distance: isTeacher
        ? "🎙️ Modalità a distanza: consulta i progressi individuali degli studenti."
        : "🎙️ Modalità a distanza: completa entrambi i ruoli; le risposte sono salvate per la revisione.",
      individual: isTeacher
        ? "🏋️ Modalità allenamento: lo studente lavora nel proprio spazio personale."
        : "🏋️ Modalità allenamento: esercitati con entrambi i ruoli nel tuo spazio personale."
    };
    if (modeNote) modeNote.textContent = descriptions[activityMode];
    if (badge) badge.textContent = group && safeGroup !== "sconosciuto"
      ? `${isTeacher ? "👩‍🏫" : "👤"} ${userName || "Utente"} · ${group}`
      : "Accedi dalla pagina iniziale per associare l’attività al gruppo.";
    if (teacherControls) teacherControls.hidden = !isTeacher || independent;

    function isCorrect(dialogue, index, value) {
      const expected = [dialogue.keys[index], ...(dialogue.acceptedAnswers?.[index] || [])];
      const actual = normalizeAnswer(value);
      return expected.some(answer => normalizeAnswer(answer) === actual);
    }

    function buildTemplate(dialogue) {
      let html = dialogue.template;
      dialogue.keys.forEach((_, index) => {
        const token = new RegExp(`\\{\\{${index}:(\\d+)\\}\\}`);
        const width = html.match(token)?.[1] || "85";
        const role = dialogue.keyRoles[index] || "A";
        const speaker = role === "A" ? dialogue.speakerA : dialogue.speakerB;
        const input = `<input type="text" class="inline-input${role === "B" ? " role-b" : ""}" style="width:${width}px" data-keyidx="${index}" aria-label="Spazio ${index + 1}, Personaggio ${role} (${speaker})" placeholder="___" disabled>`;
        html = html.replace(token, input);
      });
      return html;
    }

    function buildCard(dialogue, index) {
      const card = document.createElement("article");
      card.className = `question-slide${index === active ? " active" : ""}`;
      card.setAttribute("aria-label", `Dialogo ${index + 1} di ${dialogues.length}`);
      card.inputs = [];
      card.suffixes = {};

      const heading = document.createElement("div");
      heading.className = "question-heading";
      const headingLeft = document.createElement("div");
      headingLeft.className = "question-heading-left";
      const number = document.createElement("span");
      number.className = "question-number";
      number.textContent = String(index + 1);
      const title = document.createElement("span");
      title.textContent = dialogue.title;
      headingLeft.append(number, title);
      const roles = document.createElement("div");
      roles.className = "roles-pill";
      const roleTagA = document.createElement("span");
      roleTagA.className = "role-tag";
      const roleTagB = document.createElement("span");
      roleTagB.className = "role-tag role-b";
      roles.append(roleTagA, roleTagB);
      card.roleTagA = roleTagA;
      card.roleTagB = roleTagB;
      heading.append(headingLeft, roles);

      const grid = document.createElement("div");
      grid.className = "slide-content-grid";
      const prompt = document.createElement("div");
      prompt.className = "prompt-box";
      prompt.innerHTML = buildTemplate(dialogue);
      grid.appendChild(prompt);
      if (dialogue.img) {
        const imageContainer = document.createElement("div");
        imageContainer.className = "slide-img-container";
        const image = document.createElement("img");
        image.className = "slide-img";
        image.src = dialogue.img;
        image.alt = `Illustrazione per ${dialogue.title}`;
        image.onerror = () => imageContainer.remove();
        imageContainer.appendChild(image);
        grid.appendChild(imageContainer);
      }

      prompt.querySelectorAll("input.inline-input").forEach(input => {
        const field = Number(input.dataset.keyidx);
        card.inputs[field] = input;
        const suffix = input.nextElementSibling;
        if (suffix?.dataset.keySuffix === String(field)) card.suffixes[field] = suffix;
        input.addEventListener("focus", () => { lastActiveInput = input; });
        input.addEventListener("input", () => {
          const role = dialogue.keyRoles[field] || "A";
          if (applyingSnapshot || !canWriteRole(role)) return;
          answers[dialogue.id][field] = input.value;
          updateFeedback(index);
          card.submit.disabled = !canWriteAny() || !answers[dialogue.id].some(value => String(value || "").trim());
          setStatus("");
          const saveKey = `${index}_${field}`;
          clearTimeout(timers.get(saveKey));
          timers.set(saveKey, setTimeout(() => {
            timers.delete(saveKey);
            sync.write(`answers/${dialogue.id}/${field}`, input.value, slotFor(role))
              .catch(error => setStatus(`⚠️ Risposta non salvata: ${error?.message || "controlla la connessione"}`, true));
          }, 250));
        });
        input.addEventListener("blur", () => flushInput(index, field));
      });

      const feedback = document.createElement("p");
      feedback.className = "answer-feedback";
      feedback.setAttribute("role", "status");
      card.feedback = feedback;
      const submit = document.createElement("button");
      submit.type = "button";
      submit.className = "submit-contribution";
      submit.textContent = "📤 Invia il contributo";
      submit.disabled = true;
      submit.addEventListener("click", () => submitContribution(index));
      card.submit = submit;

      const panel = document.createElement("section");
      panel.className = "contribution-panel";
      const panelTitle = document.createElement("h2");
      panelTitle.textContent = "📋 Contributi inviati · Questo dialogo";
      const list = document.createElement("div");
      list.className = "contribution-list";
      list.setAttribute("aria-live", "polite");
      panel.append(panelTitle, list);
      card.contributionList = list;
      card.append(heading, grid, feedback, submit, panel);
      container.appendChild(card);
      cards.push(card);

      const step = document.createElement("button");
      step.type = "button";
      step.className = "progress-step";
      step.textContent = String(index + 1);
      step.setAttribute("aria-label", `Vai al dialogo ${index + 1}`);
      step.addEventListener("click", () => navigate(index));
      progress.appendChild(step);
    }

    function flushInput(index, field) {
      const key = `${index}_${field}`;
      if (!timers.has(key)) return Promise.resolve();
      clearTimeout(timers.get(key));
      timers.delete(key);
      const dialogue = dialogues[index];
      const role = dialogue.keyRoles[field] || "A";
      const value = cards[index].inputs[field].value;
      if (!canWriteRole(role)) return Promise.resolve();
      return sync.write(`answers/${dialogue.id}/${field}`, value, slotFor(role))
        .catch(error => setStatus(`⚠️ Risposta non salvata: ${error?.message || "controlla la connessione"}`, true));
    }

    function flushCard(index) {
      return Promise.all(cards[index].inputs.map((_, field) => flushInput(index, field)));
    }

    function updateFeedback(index) {
      const dialogue = dialogues[index];
      const card = cards[index];
      const values = answers[dialogue.id] || [];
      let filled = 0;
      let correct = 0;
      card.inputs.forEach((input, field) => {
        const value = String(values[field] || "").trim();
        const ok = validateAnswers && Boolean(value) && isCorrect(dialogue, field, value);
        if (value) filled++;
        if (ok) correct++;
        if (validateAnswers) {
          input.classList.toggle("correct", ok);
          input.classList.toggle("incorrect", Boolean(value) && !ok);
          input.setAttribute("aria-invalid", String(Boolean(value) && !ok));
        } else {
          input.classList.remove("correct", "incorrect");
          input.removeAttribute("aria-invalid");
        }
        if (card.suffixes[field]) card.suffixes[field].textContent = normalizeAnswer(value) === "d" ? "inglese" : " inglese";
      });
      if (!validateAnswers) {
        card.feedback.className = "answer-feedback";
        card.feedback.textContent = `Completa gli ${dialogue.keys.length} spazi del dialogo secondo il ruolo assegnato.`;
        return;
      }
      card.feedback.className = `answer-feedback${filled === dialogue.keys.length && correct === dialogue.keys.length ? " correct" : filled ? " incorrect" : ""}`;
      card.feedback.textContent = filled
        ? `${correct === dialogue.keys.length ? "✓" : "✕"} ${correct} di ${dialogue.keys.length} parole corrette${filled < dialogue.keys.length ? ` · ${dialogue.keys.length - filled} ancora da completare` : ""}.`
        : `Completa gli ${dialogue.keys.length} spazi del dialogo secondo il ruolo assegnato.`;
    }

    function renderContributions(index) {
      const dialogue = dialogues[index];
      const card = cards[index];
      const entries = ["A", "B"].flatMap(role => Object.entries(sync?.read("contributions", slotFor(role)) || {})
        .map(([id, item]) => ({ ...(item || {}), id })))
        .filter(entry => entry.dialogueId === dialogue.id && Array.isArray(entry.answers) && entry.answers.some(value => String(value || "").trim()))
        .sort((a, b) => (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0) || a.id.localeCompare(b.id));
      card.contributionList.replaceChildren();
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "Nessun contributo inviato per questo dialogo.";
        card.contributionList.appendChild(empty);
        return;
      }
      entries.forEach(entry => {
        const article = document.createElement("article");
        article.className = "contribution";
        const meta = document.createElement("span");
        meta.className = "contribution-meta";
        const time = Number(entry.timestamp) ? new Date(Number(entry.timestamp)).toLocaleString("it-IT") : "Data non disponibile";
        meta.textContent = `${entry.author || "Partecipante"} · ${time}`;
        const text = document.createElement("div");
        text.className = "contribution-text";
        text.textContent = dialogue.keys.map((_, field) => `${field + 1}. ${entry.answers[field] || "—"}`).join("   ·   ");
        article.append(meta, text);
        card.contributionList.appendChild(article);
      });
    }

    function renderCard(index) {
      if (!cards[index]) return;
      const dialogue = dialogues[index];
      const card = cards[index];
      card.roleTagA.textContent = `A (${dialogue.speakerA}): ${writerA?.name || "—"}`;
      card.roleTagB.textContent = `B (${dialogue.speakerB}): ${writerB?.name || "—"}`;
      card.inputs.forEach((input, field) => {
        const role = dialogue.keyRoles[field] || "A";
        input.disabled = !canWriteRole(role);
        const value = String(answers[dialogue.id]?.[field] || "");
        if (document.activeElement !== input && input.value !== value) input.value = value;
      });
      card.submit.disabled = !canWriteAny() || !answers[dialogue.id].some(value => String(value || "").trim());
      updateFeedback(index);
      renderContributions(index);
    }

    function updateAssignment() {
      if (!assignmentStatus) return;
      const dialogue = dialogues[active];
      const viewer = currentIdentity();
      if (!group || safeGroup === "sconosciuto") {
        assignmentStatus.textContent = "Accedi tramite il gruppo della classe per utilizzare l’esercizio.";
      } else if (!sync) {
        assignmentStatus.textContent = "Connessione all’esercizio non disponibile. Verifica la connessione e ricarica la pagina.";
      } else if (independent && isTeacher) {
        assignmentStatus.textContent = activityMode === "distance"
          ? "Modalità a distanza: seleziona uno studente per rivedere i suoi progressi."
          : "Modalità allenamento: lo studente lavora nel proprio spazio personale.";
      } else if (independent) {
        assignmentStatus.textContent = `✍️ Modalità individuale: completa entrambi i ruoli (${dialogue.speakerA} e ${dialogue.speakerB}). Le risposte sono salvate nel tuo spazio personale.`;
      } else if (!viewer) {
        assignmentStatus.textContent = "Accedi dal gruppo della classe con il tuo nome per partecipare.";
      } else if (canWriteRole("A") && canWriteRole("B")) {
        assignmentStatus.textContent = `✍️ Hai entrambi i ruoli (${dialogue.speakerA} e ${dialogue.speakerB}), ${viewer.name}.`;
      } else if (canWriteRole("A")) {
        assignmentStatus.textContent = `✍️ È il tuo turno come Personaggio A (${dialogue.speakerA}), ${viewer.name}. Personaggio B (${dialogue.speakerB}): ${writerB?.name || "non assegnato"}.`;
      } else if (canWriteRole("B")) {
        assignmentStatus.textContent = `✍️ È il tuo turno come Personaggio B (${dialogue.speakerB}), ${viewer.name}. Personaggio A (${dialogue.speakerA}): ${writerA?.name || "non assegnato"}.`;
      } else if (!writerA && !writerB) {
        assignmentStatus.textContent = isTeacher
          ? "Assegna i turni per Personaggio A e Personaggio B dai menu qui sopra."
          : "L’insegnante non ha ancora assegnato i turni per Personaggio A e Personaggio B.";
      } else {
        assignmentStatus.textContent = `🔒 Personaggio A (${dialogue.speakerA}): ${writerA?.name || "non assegnato"} · Personaggio B (${dialogue.speakerB}): ${writerB?.name || "non assegnato"}. Puoi seguire il dialogo in tempo reale.`;
      }
      cards.forEach((_, index) => renderCard(index));
    }

    function loadAnswers() {
      const nextAnswers = {};
      dialogues.forEach(dialogue => {
        const fromA = readRoleAnswers(dialogue, "A");
        const fromB = readRoleAnswers(dialogue, "B");
        nextAnswers[dialogue.id] = dialogue.keys.map((_, field) => {
          const role = dialogue.keyRoles[field] || "A";
          const values = role === "A" ? fromA : fromB;
          return String(values[field] ?? values[String(field)] ?? "");
        });
      });
      answers = nextAnswers;
      applyingSnapshot = true;
      cards.forEach((card, index) => card.inputs.forEach((input, field) => {
        if (document.activeElement !== input) input.value = answers[dialogues[index].id][field];
      }));
      applyingSnapshot = false;
    }

    function navigate(index) {
      active = Math.max(0, Math.min(dialogues.length - 1, index));
      cards.forEach((card, itemIndex) => card.classList.toggle("active", itemIndex === active));
      progress.querySelectorAll("button").forEach((button, itemIndex) => {
        button.setAttribute("aria-current", itemIndex === active ? "step" : "false");
        button.classList.toggle("done", answers[dialogues[itemIndex].id].every(value => String(value || "").trim()));
      });
      if (progressText) progressText.textContent = `Dialogo ${active + 1} di ${dialogues.length}`;
      if (progressFill) progressFill.style.width = `${((active + 1) / dialogues.length) * 100}%`;
      if (previous) previous.disabled = active === 0;
      if (next) next.disabled = active === dialogues.length - 1;
      if (nextExercise) nextExercise.hidden = active !== dialogues.length - 1;
      setStatus("");
      updateAssignment();
      const dialogue = dialogues[active];
      const cardKey = String(dialogue.id || `card_${active}`).replace(/[.#$\/\[\]]/g, "_");
      window.ParloNotesScope = { group: safeGroup, exercise: String(config.exercisePath || "003_es_i"), card: cardKey, cardLabel: `${active + 1}. ${dialogue.title}` };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", { detail: window.ParloNotesScope }));
    }

    async function submitContribution(index) {
      const dialogue = dialogues[index];
      const card = cards[index];
      if (!sync || !canWriteAny()) return;
      const values = answers[dialogue.id].map(value => String(value || "").trim());
      if (!values.some(Boolean)) {
        setStatus("Inserisci almeno una parola prima di inviare il contributo.", true);
        return;
      }
      card.submit.disabled = true;
      setStatus("Invio del contributo…");
      const role = canWriteRole("A") ? "A" : "B";
      try {
        await flushCard(index);
        const identity = currentIdentity();
        await sync.push("contributions", {
          dialogueId: dialogue.id,
          answers: values,
          author: identity?.name || "Partecipante",
          role: identity?.role || "student",
          timestamp: Date.now()
        }, slotFor(role));
        setStatus("✅ Dialogo aggiunto allo storico della scheda.");
      } catch (error) {
        setStatus(`⚠️ Contributo non inviato: ${error?.message || "controlla la connessione e riprova"}`, true);
      } finally {
        renderCard(index);
      }
    }

    SPECIAL_CHARS.forEach(character => {
      const button = [...(toolbar?.querySelectorAll(".char-btn") || [])].find(item => item.dataset.char === character);
      button?.addEventListener("click", () => {
        const card = cards[active];
        const target = document.activeElement?.matches("input.inline-input:not(:disabled)")
          ? document.activeElement
          : (lastActiveInput && card?.contains(lastActiveInput) && !lastActiveInput.disabled ? lastActiveInput : null);
        if (!target) return;
        const start = target.selectionStart ?? target.value.length;
        const end = target.selectionEnd ?? target.value.length;
        target.setRangeText(character, start, end, "end");
        target.focus();
        target.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
    toolbar?.addEventListener("mousedown", event => {
      if (event.target.closest(".char-btn")) event.preventDefault();
    });

    dialogues.forEach(buildCard);
    previous?.addEventListener("click", () => navigate(active - 1));
    next?.addEventListener("click", () => navigate(active + 1));
    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input,textarea,select,button,a,[tabindex]")) return;
      if (event.key === "ArrowLeft") navigate(active - 1);
      if (event.key === "ArrowRight") navigate(active + 1);
    });
    window.addEventListener("pagehide", () => cards.forEach((_, index) => flushCard(index)));

    if (!group || safeGroup === "sconosciuto") {
      setStatus("Accedi dalla pagina iniziale tramite il gruppo della classe per usare l’esercizio.", true);
      updateAssignment();
      navigate(0);
      return { navigate, getSync: () => sync };
    }
    const database = window.ParloModes?.initFirebase?.();
    if (!database) {
      setStatus("Servizio dati condivisi non disponibile. Verifica la connessione e ricarica la pagina.", true);
      updateAssignment();
      navigate(0);
      return { navigate, getSync: () => sync };
    }

    const exercisePath = String(config.exercisePath || "003_es_i");
    const exerciseRef = database.ref(`esercizi/gruppi/${safeGroup}/${exercisePath}`);
    sync = window.ParloModes.createSync({
      mode: "multi-turn",
      uniqueAssignments,
      ref: exerciseRef,
      database,
      session,
      slots,
      onChange(state) {
        writerA = sync.assignmentFor(slotFor("A"));
        writerB = sync.assignmentFor(slotFor("B"));
        loadAnswers();
        if (state?.onlineStudents) sync.setOnlineNames(state.onlineStudents);
        updateAssignment();
      },
      onError(error) { setStatus(`⚠️ Errore di sincronizzazione: ${error?.message || "controlla la connessione"}`, true); }
    });
    if (isTeacher && !independent) {
      if (writerASelect) sync.bindAssignmentSelect(writerASelect, slotFor("A"));
      if (writerBSelect) sync.bindAssignmentSelect(writerBSelect, slotFor("B"));
      window.ParloModes.loadGroupRoster(database, safeGroup, Number(config.unitNumber || 3), roster => sync.setRoster(roster));
    }
    database.ref(".info/connected").on("value", snapshot => {
      if (snapshot.val() === false) setStatus("⚠️ Connessione interrotta: i salvataggi potrebbero non riuscire.", true);
      else if (!statusMessage?.classList.contains("error")) setStatus("");
    });
    navigate(0);
    return { navigate, getSync: () => sync };
  }

  window.ParloInlineS2S = Object.freeze({ init });
})();
