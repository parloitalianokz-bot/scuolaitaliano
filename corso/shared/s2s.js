/* Motore student-to-student: turni condivisi online, risposte individuali fuori linea. */
(() => {
  "use strict";

  const SPECIAL_CHARS = ["'", "à", "è", "ì", "ò", "ù", "È"];
  const cleanKey = value => String(value || "").replace(/[.#$\/\[\]]/g, "_");

  function init(config = {}) {
    const session = window.ParloSession || {};
    const isTeacher = Boolean(session.isTeacher);
    const activityMode = ["distance", "individual"].includes(session.activityMode) ? session.activityMode : "online";
    const independent = activityMode !== "online";
    const exercisePath = String(config.exercisePath || "s2s");
    const cards = Array.isArray(config.cards) ? config.cards : [];
    if (!cards.length) throw new Error("ParloS2S.init richiede almeno una scheda in `cards`.");

    const progress = document.getElementById("exercise-progress");
    const container = document.getElementById("slides-container");
    const previous = document.getElementById("previous-slide");
    const next = document.getElementById("next-slide");
    const progressText = document.getElementById("slide-progress");
    const saveStatus = document.getElementById("save-status");
    const teacherControls = document.getElementById("teacher-controls");
    const questionSelect = document.getElementById("question-writer-select");
    const answerSelect = document.getElementById("answer-writer-select");
    const assignmentLabels = Array.isArray(config.assignmentLabels) ? config.assignmentLabels : [];
    [[questionSelect, assignmentLabels[0]], [answerSelect, assignmentLabels[1]]].forEach(([select, text]) => {
      if (!select || !text) return;
      const label = select.closest("label");
      const textNode = [...(label?.childNodes || [])].find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = `${text}\n        `;
    });
    const identity = session.name ? { role: isTeacher ? "teacher" : "student", name: String(isTeacher ? (session.teacherName || session.name) : session.name) } : null;
    const group = cleanKey(session.safeGroup || "sconosciuto");
    const slots = cards.flatMap((card, index) => [
      { id: `${cleanKey(card.id || `card_${index + 1}`)}_ans1`, label: `${card.name || `Scheda ${index + 1}`} · domande` },
      { id: `${cleanKey(card.id || `card_${index + 1}`)}_ans2`, label: `${card.name || `Scheda ${index + 1}`} · risposte` }
    ]);

    let sync = null;
    let active = 0;
    let roster = [];
    let onlineStudents = new Set();
    let currentAssignmentBindings = [];
    const ui = [];
    const saveTimers = new Map();

    function setStatus(message, error = false) {
      if (!saveStatus) return;
      saveStatus.textContent = message || "";
      saveStatus.hidden = !message;
      saveStatus.classList.toggle("error", error);
    }

    function slotId(index, field) { return `${cleanKey(cards[index].id || `card_${index + 1}`)}_${field}`; }
    function draft(index, field) { return String(sync?.read("draft", slotId(index, field)) || ""); }
    function canEdit(index, field) {
      return Boolean(sync && (independent ? !isTeacher && Boolean(session.studentId || session.name) : sync.canWrite(slotId(index, field))));
    }

    function createToolbar(input) {
      const toolbar = document.createElement("div");
      toolbar.className = "accent-toolbar";
      toolbar.setAttribute("role", "group");
      toolbar.setAttribute("aria-label", "Inserisci un carattere accentato");
      SPECIAL_CHARS.forEach(character => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = character;
        button.setAttribute("aria-label", character === "'" ? "Inserisci apostrofo" : `Inserisci ${character}`);
        button.addEventListener("mousedown", event => event.preventDefault());
        button.addEventListener("click", () => {
          if (input.disabled || input.readOnly) return;
          const start = input.selectionStart ?? input.value.length;
          const end = input.selectionEnd ?? start;
          input.setRangeText(character, start, end, "end");
          input.focus();
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        toolbar.appendChild(button);
      });
      return toolbar;
    }

    function addPresenceLine(parent, field) {
      const line = document.createElement("p");
      line.className = "assignment-status";
      line.setAttribute("aria-live", "polite");
      parent.appendChild(line);
      return line;
    }

    function createPanel(index, field, heading, placeholder) {
      const card = cards[index];
      const panel = document.createElement("section");
      panel.className = "answer-panel";
      const title = document.createElement("h2");
      title.textContent = heading;
      const input = document.createElement("textarea");
      input.id = `answer-${field}-${index}`;
      input.className = "answer-input";
      input.rows = 4;
      input.placeholder = placeholder;
      const label = document.createElement("label");
      label.className = "visually-hidden";
      label.htmlFor = input.id;
      label.textContent = heading;
      const toolbar = createToolbar(input);
      const bubblePrompts = config.dialogueBubbles
        ? (field === "ans1" ? card.questionPrompts : card.answerPrompts) || []
        : [];
      const bubbleInputs = [];
      let bubbleGroup = null;
      if (bubblePrompts.length) {
        input.hidden = true;
        toolbar.hidden = true;
        bubbleGroup = document.createElement("div");
        bubbleGroup.className = `dialogue-bubbles ${field === "ans1" ? "question-bubbles" : "answer-bubbles"}`;
        bubblePrompts.forEach((cue, bubbleIndex) => {
          const bubble = document.createElement("div");
          bubble.className = `dialogue-bubble ${field === "ans1" ? "question-bubble" : "answer-bubble"}`;
          const bubbleLabel = document.createElement("label");
          const bubbleInput = document.createElement("textarea");
          bubbleInput.id = `bubble-${field}-${index}-${bubbleIndex}`;
          bubbleInput.className = "bubble-input";
          bubbleInput.rows = 2;
          bubbleLabel.htmlFor = bubbleInput.id;
          bubbleLabel.textContent = `${field === "ans1" ? "Domanda" : "Risposta"} ${bubbleIndex + 1}`;
          bubble.appendChild(bubbleLabel);
          if (String(cue || "").trim()) {
            const cueText = document.createElement("p");
            cueText.className = "bubble-cue";
            cueText.lang = field === "ans1" ? "ru" : "it";
            cueText.textContent = String(cue);
            bubble.appendChild(cueText);
          }
          bubble.appendChild(bubbleInput);
          bubbleGroup.appendChild(bubble);
          bubbleInputs.push(bubbleInput);
          bubbleInput.addEventListener("input", () => {
            input.value = bubbleInputs.map(item => item.value).join("\\n");
            input.dispatchEvent(new Event("input", { bubbles: true }));
          });
          bubbleInput.addEventListener("blur", () => input.dispatchEvent(new Event("blur")));
        });
      }
      const writerStatus = addPresenceLine(panel, field);
      const submit = document.createElement("button");
      submit.type = "button";
      submit.className = "submit-answer";
      submit.textContent = "📤 Invia il contributo";
      submit.addEventListener("click", async () => {
        const text = input.value.trim();
        if (!sync || !canEdit(index, field) || !text) return;
        submit.disabled = true;
        try {
          await sync.write("draft", input.value, slotId(index, field));
          await sync.push("contributions", {
            text,
            authorName: identity?.name || "Partecipante",
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }, slotId(index, field));
          await sync.write("draft", "", slotId(index, field));
          bubbleInputs.forEach(bubbleInput => { bubbleInput.value = ""; });
          setStatus(`Contributo inviato per ${cards[index].name || `la scheda ${index + 1}`}.`);
        } catch (error) {
          setStatus(`Invio non riuscito: ${error?.message || "controlla la connessione e riprova"}`, true);
        }
      });
      input.addEventListener("input", () => {
        if (!canEdit(index, field)) return;
        const slot = slotId(index, field);
        clearTimeout(saveTimers.get(slot));
        saveTimers.set(slot, setTimeout(() => {
          saveTimers.delete(slot);
          sync.write("draft", input.value, slot).catch(error => setStatus(`Salvataggio non riuscito: ${error?.message || "riprova"}`, true));
        }, 250));
        submit.disabled = !input.value.trim();
      });
      input.addEventListener("blur", () => {
        if (!canEdit(index, field)) return;
        const slot = slotId(index, field);
        clearTimeout(saveTimers.get(slot));
        saveTimers.delete(slot);
        sync.write("draft", input.value, slot).catch(error => setStatus(`Salvataggio non riuscito: ${error?.message || "riprova"}`, true));
      });

      const contributions = document.createElement("section");
      contributions.className = "contributions";
      const contributionsHeading = document.createElement("h3");
      contributionsHeading.textContent = "Contributi inviati";
      const contributionList = document.createElement("div");
      contributionList.className = "contribution-list";
      contributions.append(contributionsHeading, contributionList);
      if (bubbleGroup) panel.append(title, label, bubbleGroup, input, writerStatus, submit, contributions);
      else panel.append(title, label, toolbar, input, writerStatus, submit, contributions);
      if (independent) {
        submit.hidden = true;
        contributions.hidden = true;
      }
      return { panel, input, toolbar, bubbleInputs, writerStatus, submit, contributionList, contributions };
    }

    function makeImageHeader(card, index) {
      const header = document.createElement("div");
      header.className = "person-header";
      if (card.img) {
        const image = document.createElement("img");
        image.className = "person-image";
        image.src = card.img;
        image.alt = card.name || "";
        image.loading = "lazy";
        image.onerror = () => { image.hidden = true; };
        header.appendChild(image);
      }
      const info = document.createElement("div");
      const title = document.createElement("span");
      title.className = "person-title";
      title.textContent = `${index + 1}. ${card.name || "Scheda"}`;
      const details = document.createElement("span");
      details.className = "person-data";
      details.textContent = [card.country ? `📍 ${card.country}` : "", card.age ? `🎂 ${card.age} anni` : ""].filter(Boolean).join("　·　");
      info.append(title, details);
      header.appendChild(info);
      return header;
    }

    cards.forEach((card, index) => {
      const slide = document.createElement("article");
      slide.className = "dialogue-slide section-box";
      slide.hidden = index !== active;
      slide.setAttribute("aria-label", `Scheda ${index + 1}: ${card.name || "dialogo"}`);
      slide.appendChild(makeImageHeader(card, index));

      const assignmentStatus = document.createElement("p");
      assignmentStatus.className = "assignment-status";
      assignmentStatus.setAttribute("aria-live", "polite");
      assignmentStatus.hidden = independent;
      slide.appendChild(assignmentStatus);

      const reviewGroup = document.createElement("div");
      reviewGroup.className = "answer-review-group";
      const columns = document.createElement("div");
      columns.className = "answer-columns";
      const first = createPanel(index, "ans1", card.firstPanelHeading || config.firstPanelHeading || "🗣️ Box sinistro · Formula le domande", card.firstPanelPlaceholder || config.firstPanelPlaceholder || "Es.: Chi è? Di dov’è? Quanti anni ha?");
      const second = createPanel(index, "ans2", card.secondPanelHeading || config.secondPanelHeading || "💬 Box destro · Scrivi le risposte", card.secondPanelPlaceholder || config.secondPanelPlaceholder || "Scrivi risposte complete in italiano...");
      columns.append(first.panel, second.panel);
      reviewGroup.appendChild(columns);
      slide.appendChild(reviewGroup);

      const studentHints = document.createElement("details");
      studentHints.className = "suggestion";
      const studentSummary = document.createElement("summary");
      studentSummary.textContent = "Suggerimenti";
      const studentText = document.createElement("p");
      studentText.lang = "ru";
      studentText.textContent = config.studentHint || "Посмотри на имя, страну и возраст. Какие вопросы помогут узнать эти сведения? Как можно построить полный вопрос и полный ответ? Какие слова изменятся, если речь идёт о двух людях? Проверь, звучит ли диалог естественно.";
      studentHints.append(studentSummary, studentText);
      slide.appendChild(studentHints);

      if (isTeacher && config.teacherHint) {
        const teacherHints = document.createElement("details");
        teacherHints.className = "suggestion teacher-suggestion";
        const summary = document.createElement("summary");
        summary.textContent = "Spunti per l’insegnante · think aloud e LAD";
        const hint = document.createElement("p");
        hint.textContent = config.teacherHint;
        teacherHints.append(summary, hint);
        slide.appendChild(teacherHints);
      }
      container.appendChild(slide);
      ui.push({ slide, assignmentStatus, fields: { ans1: first, ans2: second } });

      const step = document.createElement("button");
      step.type = "button";
      step.className = "progress-step";
      step.textContent = String(index + 1);
      step.title = card.name || `Scheda ${index + 1}`;
      step.setAttribute("aria-label", `Vai alla scheda ${index + 1}: ${card.name || "dialogo"}`);
      step.addEventListener("click", () => showCard(index));
      progress.appendChild(step);
    });

    function identityKey(person) {
      return person?.role && person?.name ? JSON.stringify({ role: person.role, name: person.name }) : "";
    }

    function fillAssignmentMenu(select, field) {
      if (!select) return;
      const slot = slotId(active, field);
      const assigned = sync?.assignmentFor(slot) || null;
      const current = identityKey(assigned);
      const otherField = field === "ans1" ? "ans2" : "ans1";
      const other = sync?.assignmentFor(slotId(active, otherField)) || null;
      const options = [new Option("— Nessuno assegnato —", "")];
      const people = [...new Map(roster.map(person => {
        const name = String(person?.nome || person?.name || "").trim();
        return [name, { role: "student", name }];
      }).filter(([name]) => name)).values()];
      const online = people.filter(person => onlineStudents.has(person.name));
      const offline = people.filter(person => !onlineStudents.has(person.name));
      [[online, "🟢 Studenti online"], [offline, "Studenti offline"]].forEach(([list, label]) => {
        if (!list.length) return;
        const groupOption = document.createElement("optgroup");
        groupOption.label = label;
        list.forEach(person => {
          if (config.allowSameAssignee !== true && other?.role === person.role && other?.name === person.name && current !== identityKey(person)) return;
          groupOption.appendChild(new Option(`${onlineStudents.has(person.name) ? "🟢 " : ""}${person.name}`, identityKey(person)));
        });
        if (groupOption.children.length) options.push(groupOption);
      });
      if (assigned?.role === "student" && !people.some(person => person.name === assigned.name)) {
        const currentGroup = document.createElement("optgroup");
        currentGroup.label = "Turno attuale";
        currentGroup.appendChild(new Option(`${assigned.name} · non presente nell’elenco`, current));
        options.push(currentGroup);
      }
      if (assigned?.role === "teacher") {
        const teacherGroup = document.createElement("optgroup");
        teacherGroup.label = "👩‍🏫 Insegnante";
        teacherGroup.appendChild(new Option(assigned.name, current));
        options.push(teacherGroup);
      }
      select.replaceChildren(...options);
      select.value = current;
    }

    function bindAssignmentMenus() {
      currentAssignmentBindings.forEach(({ select, handler }) => select.removeEventListener("change", handler));
      currentAssignmentBindings = [];
      if (!isTeacher || activityMode !== "online" || !sync) return;
      [[questionSelect, "ans1"], [answerSelect, "ans2"]].forEach(([select, field]) => {
        if (!select) return;
        fillAssignmentMenu(select, field);
        const handler = () => {
          let target = null;
          try { target = select.value ? JSON.parse(select.value) : null; } catch (_) {}
          const other = sync.assignmentFor(slotId(active, field === "ans1" ? "ans2" : "ans1"));
          if (config.allowSameAssignee !== true && target && other && target.role === other.role && target.name === other.name) {
            setStatus("Assegna i due turni a studenti diversi.", true);
            updateUI();
            return;
          }
          sync.setAssignment(slotId(active, field), target).catch(error => setStatus(error.message || "Impossibile assegnare il turno.", true));
        };
        select.addEventListener("change", handler);
        currentAssignmentBindings.push({ select, handler });
      });
    }

    function renderContributions(fieldUI, index, field) {
      const list = fieldUI.contributionList;
      list.replaceChildren();
      const values = sync?.read("contributions", slotId(index, field)) || {};
      const entries = Object.entries(values).map(([id, item]) => ({ id, ...(item || {}) }))
        .sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "Nessun contributo inviato per questo box.";
        list.appendChild(empty);
        return;
      }
      entries.forEach(entry => {
        const article = document.createElement("article");
        article.className = "contribution";
        const meta = document.createElement("span");
        meta.className = "contribution-meta";
        meta.textContent = `${entry.authorName || "Partecipante"}${entry.timestamp ? ` · ${new Date(entry.timestamp).toLocaleString("it-IT")}` : ""}`;
        const text = document.createElement("div");
        text.className = "contribution-text";
        text.textContent = entry.text || "";
        article.append(meta, text);
        list.appendChild(article);
      });
    }

    function renderCard(index) {
      const item = ui[index];
      const card = cards[index];
      const writerNames = [];
      ["ans1", "ans2"].forEach(field => {
        const fieldUI = item.fields[field];
        const input = fieldUI.input;
        const editable = canEdit(index, field);
        const currentDraft = draft(index, field);
        if (document.activeElement !== input && input.value !== currentDraft) input.value = currentDraft;
        if (fieldUI.bubbleInputs?.length) {
          const values = input.value.split("\\n");
          fieldUI.bubbleInputs.forEach((bubbleInput, bubbleIndex) => {
            if (document.activeElement !== bubbleInput && bubbleInput.value !== (values[bubbleIndex] || "")) {
              bubbleInput.value = values[bubbleIndex] || "";
            }
            bubbleInput.readOnly = isTeacher && independent;
            bubbleInput.disabled = !editable && !(isTeacher && independent);
          });
        }
        input.readOnly = isTeacher && independent;
        input.disabled = !editable && !(isTeacher && independent);
        fieldUI.toolbar.querySelectorAll("button").forEach(button => { button.disabled = !editable; });
        fieldUI.submit.disabled = !editable || !input.value.trim();
        fieldUI.submit.title = editable ? "Invia un contributo" : "Il turno per questo box non è assegnato a te";
        const assignee = sync?.assignmentFor(slotId(index, field));
        fieldUI.writerStatus.textContent = independent ? (isTeacher ? "Risposta personale dello studente." : "La risposta viene salvata nel tuo spazio personale.")
          : assignee ? (editable ? "✍️ Il turno è tuo: puoi scrivere." : `Turno assegnato a ${assignee.name}.`) : "Turno non assegnato: chiedi all’insegnante.";
        if (assignee) writerNames.push(assignee.name);
        renderContributions(fieldUI, index, field);
      });
      const status = item.assignmentStatus;
      status.textContent = independent ? (isTeacher ? "Lavoro individuale dello studente selezionato." : "Compila entrambi i ruoli: le risposte sono salvate nel tuo spazio personale.")
        : writerNames.length ? `Turni assegnati: ${writerNames.join(" e ")}.` : "L’insegnante assegna i ruoli per questo dialogo.";
      item.slide.classList.toggle("active", index === active);
      const step = progress.children[index];
      const completed = independent
        ? Boolean(draft(index, "ans1").trim() && draft(index, "ans2").trim())
        : ["ans1", "ans2"].some(field => Object.keys(sync?.read("contributions", slotId(index, field)) || {}).length || draft(index, field).trim());
      step.classList.toggle("done", completed);
      step.setAttribute("aria-current", index === active ? "step" : "false");
    }

    function notifyReviewScope() {
      const card = cards[active];
      window.ParloNotesScope = {
        group,
        exercise: exercisePath,
        card: `card_${active}`,
        reviewCard: `card_${active}`,
        cardLabel: `${active + 1}. ${card.name || "Mini dialogo"}`
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", { detail: window.ParloNotesScope }));
    }

    function updateUI() {
      ui.forEach((_, index) => renderCard(index));
      if (teacherControls) teacherControls.hidden = !isTeacher || activityMode !== "online";
      bindAssignmentMenus();
      progressText.textContent = `Scheda ${active + 1} di ${cards.length}`;
      previous.disabled = active === 0;
      next.disabled = active === cards.length - 1;
      if (questionSelect) fillAssignmentMenu(questionSelect, "ans1");
      if (answerSelect) fillAssignmentMenu(answerSelect, "ans2");
    }

    function showCard(index, scroll = true) {
      active = Math.max(0, Math.min(cards.length - 1, index));
      ui.forEach((item, itemIndex) => { item.slide.hidden = itemIndex !== active; });
      updateUI();
      if (scroll) ui[active].slide.scrollIntoView({ behavior: "smooth", block: "nearest" });
      notifyReviewScope();
    }

    previous?.addEventListener("click", () => showCard(active - 1));
    next?.addEventListener("click", () => showCard(active + 1));
    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input, textarea, select, button, a, [tabindex]")) return;
      if (event.key === "ArrowLeft") showCard(active - 1);
      if (event.key === "ArrowRight") showCard(active + 1);
    });

    if (document.getElementById("exercise-menu")) {
      document.getElementById("exercise-menu").addEventListener("change", event => {
        if (!event.target.value) return;
        const target = new URL(event.target.value, location.href);
        if (session.group && session.group !== "sconosciuto") target.searchParams.set("gruppo", session.group);
        if (!isTeacher && session.name) target.searchParams.set("nome", session.name);
        location.assign(`${target.pathname}${target.search}${target.hash}`);
      });
    }

    const db = window.ParloModes?.initFirebase?.();
    if (db && group !== "sconosciuto") {
      const exerciseRef = db.ref(`esercizi/gruppi/${group}/${exercisePath}`);
      sync = ParloModes.createSync({
        mode: "multi-turn",
        ref: exerciseRef,
        database: db,
        session,
        slots,
        onChange(state) {
          onlineStudents = state.onlineStudents || new Set();
          updateUI();
        },
        onError(error) { setStatus(`Errore di sincronizzazione: ${error?.message || "controlla la connessione"}`, true); }
      });
      if (isTeacher && activityMode === "online") {
        ParloModes.loadGroupRoster(db, group, Number(config.unitNumber || 2), list => {
          roster = list;
          updateUI();
        });
      }
      db.ref(".info/connected").on("value", snapshot => {
        if (snapshot.val() === false) setStatus("Connessione a Firebase interrotta: i salvataggi potrebbero non riuscire.", true);
        else if (!saveStatus?.classList.contains("error")) setStatus("");
      });
    } else {
      setStatus(group === "sconosciuto" ? "Accedi dalla pagina iniziale per usare l’attività condivisa." : "Servizio dati condivisi non disponibile.", true);
    }

    if (document.body.dataset.reviewAnswerSelector == null) document.body.dataset.reviewAnswerSelector = ".answer-review-group";
    if (document.body.dataset.reviewCommentPlacement == null) document.body.dataset.reviewCommentPlacement = "section";
    const reviewStyle = document.createElement("style");
    reviewStyle.textContent = ".answer-review-group.review-approved .answer-panel{border-color:#187341!important;background:#f0faf3!important}.answer-review-group.review-rejected .answer-panel{border-color:#b42318!important;background:#fff4f2!important}";
    document.head.appendChild(reviewStyle);

    updateUI();
    showCard(0, false);
    window.ParloNotesScope = window.ParloNotesScope || {};
    if (window.ParloExercise) {
      ParloExercise.initBackgroundParallax?.();
      ParloExercise.decorateSessionLinks?.();
    }
    return { showCard, getSync: () => sync };
  }

  window.ParloS2S = Object.freeze({ init });
})();
