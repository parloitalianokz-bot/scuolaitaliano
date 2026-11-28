/* Riordino di dialoghi a fumetti con turni distinti per Personaggio A e B. */
(() => {
  "use strict";

  function normalize(value) {
    return String(value ?? "").trim().toLocaleLowerCase("it")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function formatPerson(person, onlineSet) {
    if (!person) return "Non assegnato";
    if (person.role === "teacher") return `👩‍🏫 ${person.name}`;
    return `${onlineSet instanceof Set && onlineSet.has(person.name) ? "🟢" : "⚪"} ${person.name}`;
  }

  function init(config = {}) {
    const dialogues = Array.isArray(config.dialogues) ? config.dialogues : [];
    if (!dialogues.length) throw new Error("ParloRiordinoS2S.init richiede almeno un dialogo.");

    const session = window.ParloSession || {};
    const isTeacher = Boolean(session.isTeacher);
    const activityMode = ["distance", "individual"].includes(session.activityMode) ? session.activityMode : "online";
    const isPersonal = !isTeacher && activityMode !== "online";
    const safeGroup = session.safeGroup || "sconosciuto";
    const exercisePath = String(config.exercisePath || "riordino_s2s");
    const container = document.getElementById("questions-container");
    const progress = document.getElementById("exercise-progress");
    const previous = document.getElementById("previous-question");
    const next = document.getElementById("next-question");
    const progressText = document.getElementById("question-progress");
    const nextExercise = document.getElementById("next-exercise");
    const connectionBanner = document.getElementById("connection-banner");
    const slots = dialogues.flatMap((dialogue, index) => [
      { id: `dialogo_${index + 1}_A`, label: `Dialogo ${index + 1} · Personaggio A` },
      { id: `dialogo_${index + 1}_B`, label: `Dialogo ${index + 1} · Personaggio B` }
    ]);
    const cards = [];
    let sync = null;
    let active = 0;

    const setConnection = message => {
      if (!connectionBanner) return;
      connectionBanner.textContent = message || "";
      connectionBanner.hidden = !message;
    };
    const slotFor = (dialogueIndex, role) => `dialogo_${dialogueIndex + 1}_${role}`;
    const getLineState = (dialogueIndex, lineIndex) => {
      const dialogue = dialogues[dialogueIndex];
      const line = dialogue.lines[lineIndex];
      const raw = sync?.read(`lines/${line.id}`, slotFor(dialogueIndex, line.role));
      const order = Array.isArray(raw?.order) ? raw.order.filter((token, index, array) =>
        Number.isInteger(token) && token >= 0 && token < line.words.length && array.indexOf(token) === index
      ) : [];
      return { order, verified: Boolean(raw?.verified) };
    };
    const assigneeFor = (dialogueIndex, role) => sync?.assignmentFor(slotFor(dialogueIndex, role)) || null;

    dialogues.forEach((dialogue, dialogueIndex) => {
      const card = document.createElement("article");
      card.className = "s2s-card";
      card.hidden = dialogueIndex !== active;

      const heading = document.createElement("header");
      heading.className = "s2s-heading";
      const title = document.createElement("h2");
      title.textContent = dialogue.title;
      const assignments = document.createElement("div");
      assignments.className = "s2s-assignments";
      assignments.hidden = !isTeacher;
      const roleSelects = {};
      ["A", "B"].forEach(role => {
        const label = document.createElement("label");
        label.className = `s2s-assignment s2s-role-${role.toLowerCase()}`;
        label.textContent = `Assegna Personaggio ${role}`;
        const select = document.createElement("select");
        select.setAttribute("aria-label", `Assegna Personaggio ${role} per ${dialogue.title}`);
        label.appendChild(select);
        assignments.appendChild(label);
        roleSelects[role] = select;
      });
      heading.append(title, assignments);
      card.appendChild(heading);

      const turnList = document.createElement("div");
      turnList.className = "s2s-turn-list";
      const lineUIs = [];
      dialogue.lines.forEach((line, lineIndex) => {
        const role = line.role === "B" ? "B" : "A";
        const turn = document.createElement("section");
        turn.className = `s2s-turn s2s-turn-${role.toLowerCase()}`;
        turn.setAttribute("aria-label", `Battuta ${lineIndex + 1}, Personaggio ${role}`);

        const avatar = document.createElement("span");
        avatar.className = `s2s-avatar s2s-avatar-${role.toLowerCase()}`;
        avatar.textContent = role === "A" ? "👩" : "👨";
        avatar.setAttribute("aria-hidden", "true");

        const content = document.createElement("div");
        content.className = "s2s-turn-content";
        const speaker = document.createElement("div");
        speaker.className = `s2s-speaker s2s-speaker-${role.toLowerCase()}`;
        speaker.textContent = `Personaggio ${role} · ${formatPerson(null)}`;
        const bubble = document.createElement("div");
        bubble.className = `s2s-bubble s2s-bubble-${role.toLowerCase()}`;
        bubble.setAttribute("aria-label", `Frase composta da Personaggio ${role}`);
        bubble.setAttribute("aria-live", "polite");
        const bankLabel = document.createElement("span");
        bankLabel.className = "s2s-bank-label";
        bankLabel.textContent = "Parole disponibili: clicca per inserirle";
        const bank = document.createElement("div");
        bank.className = "s2s-word-bank";
        const feedback = document.createElement("span");
        feedback.className = "s2s-feedback";
        feedback.setAttribute("role", "status");
        content.append(speaker, bubble, bankLabel, bank, feedback);
        turn.append(avatar, content);
        turnList.appendChild(turn);
        lineUIs.push({ line, role, speaker, bubble, bank, feedback });
      });
      const verifyDialogue = document.createElement("button");
      verifyDialogue.type = "button";
      verifyDialogue.className = "s2s-verify";
      verifyDialogue.textContent = "Verifica dialogo";
      verifyDialogue.addEventListener("click", async () => {
        const allComplete = dialogue.lines.every((line, lineIndex) =>
          getLineState(dialogueIndex, lineIndex).order.length === line.words.length);
        if (!allComplete) return;
        for (const [lineIndex, line] of dialogue.lines.entries()) {
          const state = getLineState(dialogueIndex, lineIndex);
          const slot = slotFor(dialogueIndex, line.role);
          if (!sync?.canWrite(slot) || state.verified) continue;
          const correct = line.correctOrder.map(normalize);
          const actual = state.order.map(tokenIndex => normalize(line.words[tokenIndex]));
          try {
            await sync.write(`lines/${line.id}`, { order: state.order, verified: true }, slot);
            lineUIs[lineIndex].feedback.textContent = actual.every((word, index) => word === correct[index])
              ? "✓ Battuta corretta!" : "La battuta non è ancora nell’ordine giusto: puoi riordinare le parole.";
          } catch (error) {
            lineUIs[lineIndex].feedback.textContent = `⚠️ Non è stato possibile verificare: ${error?.message || "riprova"}`;
          }
        }
      });
      card.append(turnList, verifyDialogue);
      container.appendChild(card);
      cards.push({ card, roleSelects, lineUIs, verifyDialogue });

      const step = document.createElement("button");
      step.type = "button";
      step.className = "progress-step";
      step.textContent = String(dialogueIndex + 1);
      step.setAttribute("aria-label", `Vai al dialogo ${dialogueIndex + 1}: ${dialogue.title}`);
      step.addEventListener("click", () => show(dialogueIndex));
      progress.appendChild(step);
    });

    function updateProgress() {
      const last = active === dialogues.length - 1;
      if (previous) previous.disabled = active === 0;
      if (next) next.hidden = last;
      if (nextExercise) nextExercise.hidden = !last;
      progress?.querySelectorAll(".progress-step").forEach((step, index) => {
        step.setAttribute("aria-current", index === active ? "step" : "false");
        const complete = dialogues[index].lines.every((_, lineIndex) => getLineState(index, lineIndex).verified);
        step.classList.toggle("done", complete);
      });
      if (progressText) progressText.textContent = `Dialogo ${active + 1} di ${dialogues.length}`;
    }

    function show(index) {
      active = Math.max(0, Math.min(dialogues.length - 1, index));
      cards.forEach((item, cardIndex) => { item.card.hidden = cardIndex !== active; });
      updateProgress();
      const dialogue = dialogues[active];
      window.ParloNotesScope = {
        group: safeGroup,
        exercise: exercisePath,
        card: String(dialogue.id || `dialogo_${active + 1}`).replace(/[.#$\/\[\]]/g, "_"),
        cardLabel: dialogue.title
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", { detail: window.ParloNotesScope }));
    }

    async function saveLine(dialogueIndex, lineIndex, order) {
      const line = dialogues[dialogueIndex].lines[lineIndex];
      const slot = slotFor(dialogueIndex, line.role);
      if (!sync?.canWrite(slot)) return;
      try {
        await sync.write(`lines/${line.id}`, { order, verified: false }, slot);
      } catch (error) {
        cards[dialogueIndex].lineUIs[lineIndex].feedback.textContent = `⚠️ Salvataggio non riuscito: ${error?.message || "riprova"}`;
      }
    }

    function makeToken(text, className, disabled, handler, label) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.textContent = text;
      button.disabled = disabled;
      button.setAttribute("aria-label", label);
      button.addEventListener("click", handler);
      return button;
    }

    function render(onlineSet = new Set()) {
      cards.forEach((item, dialogueIndex) => {
        ["A", "B"].forEach(role => {
          const person = assigneeFor(dialogueIndex, role);
          item.lineUIs.filter(ui => ui.role === role).forEach(ui => {
            ui.speaker.textContent = `Personaggio ${role} · ${formatPerson(person, onlineSet)}`;
          });
        });
        item.lineUIs.forEach((ui, lineIndex) => {
          const { line, role, bubble, bank, feedback } = ui;
          const state = getLineState(dialogueIndex, lineIndex);
          const slot = slotFor(dialogueIndex, role);
          const canEdit = Boolean(sync?.canWrite(slot));
          const selected = new Set(state.order);
          bubble.replaceChildren();
          state.order.forEach((tokenIndex, position) => {
            const word = line.words[tokenIndex];
            const button = makeToken(word, "s2s-token s2s-token-in-bubble", !canEdit,
              () => saveLine(dialogueIndex, lineIndex, state.order.filter(value => value !== tokenIndex)),
              `Rimetti «${word}» tra le parole disponibili`);
            bubble.appendChild(button);
          });
          if (!state.order.length) {
            const placeholder = document.createElement("span");
            placeholder.className = "s2s-placeholder";
            placeholder.textContent = "Componi qui la battuta…";
            bubble.appendChild(placeholder);
          }
          bank.replaceChildren();
          line.words.forEach((word, tokenIndex) => {
            if (selected.has(tokenIndex)) return;
            bank.appendChild(makeToken(word, "s2s-token", !canEdit,
              () => saveLine(dialogueIndex, lineIndex, [...state.order, tokenIndex]),
              `Inserisci «${word}» nella battuta`));
          });
          if (state.verified) {
            const correct = line.correctOrder.map(normalize);
            const actual = state.order.map(tokenIndex => normalize(line.words[tokenIndex]));
            feedback.textContent = actual.every((word, index) => word === correct[index])
              ? "✓ Battuta corretta!" : "La battuta non è ancora nell’ordine giusto: puoi riordinare le parole.";
          } else if (!feedback.textContent.startsWith("⚠️")) {
            feedback.textContent = "";
          }
        });
        const allComplete = item.lineUIs.every((ui, lineIndex) =>
          getLineState(dialogueIndex, lineIndex).order.length === ui.line.words.length);
        const hasPendingEditableLine = item.lineUIs.some((ui, lineIndex) =>
          sync?.canWrite(slotFor(dialogueIndex, ui.role)) && !getLineState(dialogueIndex, lineIndex).verified);
        item.verifyDialogue.disabled = !allComplete || !hasPendingEditableLine;
      });
      updateProgress();
    }

    previous?.addEventListener("click", () => show(active - 1));
    next?.addEventListener("click", () => show(active + 1));
    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input, textarea, select, button, a, [tabindex]")) return;
      if (event.key === "ArrowLeft") show(active - 1);
      if (event.key === "ArrowRight") show(active + 1);
    });

    const db = window.ParloModes?.initFirebase?.();
    if (!db) {
      setConnection("⚠️ Connessione al database non disponibile: verifica la rete o ricarica la pagina.");
    } else {
      db.ref(".info/connected").on("value", snapshot => setConnection(snapshot.val() === false
        ? "⚠️ Connessione a Firebase interrotta: i salvataggi potrebbero non riuscire finché non torna la rete."
        : ""));
      sync = window.ParloModes.createSync({
        mode: "multi-turn",
        uniqueAssignments: false,
        ref: db.ref(`esercizi/gruppi/${safeGroup}/${exercisePath}`),
        database: db,
        session,
        slots,
        onChange(state) { render(state?.onlineStudents || new Set()); },
        onError(error) { setConnection(`⚠️ Errore di sincronizzazione: ${error?.message || "controlla la connessione"}`); }
      });
      if (isTeacher) {
        cards.forEach((item, dialogueIndex) => ["A", "B"].forEach(role =>
          sync.bindAssignmentSelect(item.roleSelects[role], slotFor(dialogueIndex, role))
        ));
        window.ParloModes.loadGroupRoster(db, safeGroup, Number(config.unitNumber || 7), roster => sync.setRoster(roster));
      }
    }

    render();
    show(0);
    if (window.ParloExercise) {
      window.ParloExercise.initBackgroundParallax?.();
      window.ParloExercise.decorateSessionLinks?.();
      window.ParloExercise.bindNavigationSelect?.(document.getElementById("exercise-menu"));
      window.ParloExercise.bindNavigationSelect?.(document.getElementById("grammar-menu"));
    }
    return { show, getSync: () => sync };
  }

  window.ParloRiordinoS2S = Object.freeze({ init });
})();
