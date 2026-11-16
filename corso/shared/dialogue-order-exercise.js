/* Motore condiviso per esercizi di riordino dialoghi a schede separate e turni per scheda. */
(() => {
  "use strict";

  function formatAssigneeLabel(person, onlineSet) {
    if (!person) return "Nessuno";
    if (person.role === "teacher") return `👩‍🏫 ${person.name}`;
    const isOnline = onlineSet instanceof Set && onlineSet.has(person.name);
    return `${isOnline ? "🟢" : "⚪"} ${person.name}`;
  }

  function normalizeLine(text) {
    return String(text || "")
      .trim()
      .toLocaleLowerCase("it")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, " ");
  }

  function initDialogueOrderExercise(config = {}) {
    const unitNumber = Number(config.unitNumber || 1);
    const exercisePath = String(
      config.exercisePath ||
      location.pathname.split("/").pop().replace(/\.html$/i, "").replace(/[.#$\/\[\]]/g, "_") ||
      "es_dialogue_order"
    );
    const dialogues = Array.isArray(config.dialogues) ? config.dialogues : [];

    if (!dialogues.length) {
      throw new Error("initDialogueOrderExercise richiede almeno un dialogo in `dialogues`.");
    }

    const session = window.ParloSession || {};
    const isTeacherView = Boolean(session.isTeacher);
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

    // Lettura unificata dello stato atomico { order, verified } con fallback legacy
    function getCardState(index) {
      const initial = Array.isArray(dialogues[index].initialOrder)
        ? dialogues[index].initialOrder.slice()
        : [];
      if (!sync) {
        return { order: initial, verified: false };
      }

      const slotId = slots[index].id;
      const atomicState = sync.read("state", slotId);
      if (atomicState && typeof atomicState === "object") {
        const order = Array.isArray(atomicState.order) && atomicState.order.length === initial.length
          ? atomicState.order.slice()
          : initial;
        return {
          order,
          verified: Boolean(atomicState.verified)
        };
      }

      const legacyOrder = sync.read("order", slotId);
      const legacyVerified = sync.read("verified", slotId);
      return {
        order: Array.isArray(legacyOrder) && legacyOrder.length === initial.length
          ? legacyOrder.slice()
          : initial,
        verified: Boolean(legacyVerified)
      };
    }

    dialogues.forEach((dialogue, index) => {
      const slotId = slots[index].id;
      const hasVerification = Array.isArray(dialogue.correctOrder) &&
        dialogue.correctOrder.length === dialogue.initialOrder.length;

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
      textSpan.textContent = dialogue.title;
      title.append(numSpan, textSpan);

      const turnPill = document.createElement("span");
      turnPill.className = "turn-pill";
      turnPill.textContent = "✍️ Turno: Nessuno";

      header.append(title, turnPill);

      const assignmentBar = document.createElement("div");
      assignmentBar.className = "turn-assignment-bar";
      assignmentBar.hidden = !isTeacherView;

      const assignLabel = document.createElement("label");
      assignLabel.htmlFor = `assign-turn-${index}`;
      assignLabel.textContent = "✍️ Assegna turno di lavoro:";

      const assignSelect = document.createElement("select");
      assignSelect.id = `assign-turn-${index}`;
      if (isTeacherView) {
        assignmentBar.append(assignLabel, assignSelect);
      }

      const worksheetCard = document.createElement("div");
      worksheetCard.className = "worksheet-card";

      const worksheetHeader = document.createElement("div");
      worksheetHeader.className = "worksheet-header";
      const worksheetLabel = document.createElement("span");
      worksheetLabel.className = "worksheet-label";
      worksheetLabel.textContent = "💬 Battute del dialogo:";
      const turnHintTag = document.createElement("span");
      turnHintTag.className = "turn-hint-tag";
      turnHintTag.textContent = "In attesa di assegnazione";
      worksheetHeader.append(worksheetLabel, turnHintTag);

      // Layout con eventuale immagine verticale 9:16 a sinistra
      const dialogueLayout = document.createElement("div");
      const imageSrc = typeof dialogue.image === "string" ? dialogue.image.trim() : "";
      dialogueLayout.className = imageSrc ? "dialogue-layout has-portrait" : "dialogue-layout";

      if (imageSrc) {
        const figure = document.createElement("figure");
        figure.className = "character-portrait";

        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = dialogue.imageAlt || dialogue.title;
        img.loading = "lazy";
        if (dialogue.imagePosition) {
          img.style.setProperty("--portrait-position", String(dialogue.imagePosition));
        }

        const handleImageFailure = () => {
          figure.hidden = true;
          dialogueLayout.classList.remove("has-portrait");
        };

        img.addEventListener("error", handleImageFailure, { once: true });
        img.addEventListener("load", () => {
          if (img.naturalWidth === 0) handleImageFailure();
        }, { once: true });

        figure.appendChild(img);

        if (dialogue.imageCaption) {
          const caption = document.createElement("figcaption");
          caption.textContent = dialogue.imageCaption;
          figure.appendChild(caption);
        }

        dialogueLayout.appendChild(figure);
      }

      const linesList = document.createElement("div");
      linesList.className = "dialogue-lines";
      dialogueLayout.appendChild(linesList);

      const actionsRow = document.createElement("div");
      actionsRow.className = "actions-row";

      const syncFeedback = document.createElement("span");
      syncFeedback.className = "sync-feedback";
      syncFeedback.setAttribute("role", "status");
      syncFeedback.setAttribute("aria-live", "polite");
      actionsRow.appendChild(syncFeedback);

      let verifyBtn = null;
      if (hasVerification) {
        verifyBtn = document.createElement("button");
        verifyBtn.type = "button";
        verifyBtn.className = "btn-verify";
        verifyBtn.textContent = "✅ Verifica l’ordine";
        verifyBtn.disabled = true;

        verifyBtn.addEventListener("click", async () => {
          if (!sync || !sync.canWrite(slotId)) return;
          verifyBtn.disabled = true;
          setCardFeedback(index, "saving", "⏳ Verifica in corso...");
          try {
            const currentState = getCardState(index);
            await sync.write("state", {
              order: currentState.order,
              verified: true
            }, slotId);
            setCardFeedback(index, "saved", "✓ Verifica completata", 3000);
          } catch (error) {
            setCardFeedback(index, "error", `⚠️ Errore durante la verifica: ${error?.message || "riprova"}`);
          } finally {
            verifyBtn.disabled = !sync.canWrite(slotId);
          }
        });
        actionsRow.appendChild(verifyBtn);
      }

      const verificationSummary = document.createElement("p");
      verificationSummary.className = "automatic-score";
      verificationSummary.hidden = true;

      worksheetCard.append(worksheetHeader, dialogueLayout, actionsRow, verificationSummary);

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
        linesList,
        syncFeedback,
        verifyBtn,
        verificationSummary,
        hasVerification
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
        const isDone = getCardState(index).verified;
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

    // Scrittura atomica di { order, verified: false } in un'unica operazione
    async function moveLine(index, from, to) {
      const slotId = slots[index].id;
      if (!sync || !sync.canWrite(slotId)) return;

      const currentOrder = getCardState(index).order;
      if (to < 0 || to >= currentOrder.length) return;

      [currentOrder[from], currentOrder[to]] = [currentOrder[to], currentOrder[from]];
      setCardFeedback(index, "saving", "⏳ Salvataggio in corso...");
      try {
        await sync.write("state", {
          order: currentOrder,
          verified: false
        }, slotId);
        setCardFeedback(index, "saved", "✓ Salvato", 2000);
      } catch (error) {
        setCardFeedback(index, "error", `⚠️ Errore di salvataggio: ${error?.message || "riprova"}`);
      }
    }

    function renderCard(index, onlineSet) {
      const ui = cardUI[index];
      const dialogue = dialogues[index];
      const slotId = slots[index].id;
      const assignee = sync ? sync.assignmentFor(slotId) : null;
      const canEdit = Boolean(sync && sync.canWrite(slotId));
      const { order: ordering, verified: isVerified } = getCardState(index);

      ui.turnPill.textContent = `✍️ Turno: ${formatAssigneeLabel(assignee, onlineSet)}`;
      ui.turnPill.classList.toggle("is-me", canEdit);

      ui.worksheetCard.classList.toggle("active-turn", canEdit);
      ui.turnHintTag.textContent = canEdit
        ? "È il tuo turno"
        : assignee
          ? `In turno: ${formatAssigneeLabel(assignee, onlineSet)}`
          : "In attesa di assegnazione";

      if (ui.verifyBtn) {
        ui.verifyBtn.disabled = !canEdit;
      }

      ui.linesList.replaceChildren();

      const fixedItem = document.createElement("div");
      fixedItem.className = "line-item fixed";
      const fixedBadge = document.createElement("span");
      fixedBadge.className = "line-badge";
      fixedBadge.textContent = "1";
      const fixedText = document.createElement("span");
      fixedText.className = "line-text";
      fixedText.textContent = dialogue.fixed;
      fixedItem.append(fixedBadge, fixedText);
      ui.linesList.appendChild(fixedItem);

      let correctCount = 0;

      ordering.forEach((lineTextValue, lineIndex) => {
        const lineItem = document.createElement("div");
        lineItem.className = "line-item";

        let isLineCorrect = false;
        if (isVerified && ui.hasVerification) {
          isLineCorrect = normalizeLine(lineTextValue) === normalizeLine(dialogue.correctOrder[lineIndex]);
          if (isLineCorrect) correctCount++;
          lineItem.classList.add(isLineCorrect ? "line-correct" : "line-incorrect");
        }

        const badge = document.createElement("span");
        badge.className = "line-badge";
        badge.textContent = String(lineIndex + 2);

        const content = document.createElement("div");
        content.className = "line-content";
        const textEl = document.createElement("span");
        textEl.className = "line-text";
        textEl.textContent = lineTextValue;
        content.appendChild(textEl);

        if (isVerified && ui.hasVerification) {
          const checkTag = document.createElement("span");
          checkTag.className = "line-check-tag";
          checkTag.textContent = isLineCorrect
            ? "✓ Posizione corretta"
            : `✕ Posizione sbagliata (qui va: ${dialogue.correctOrder[lineIndex]})`;
          content.appendChild(checkTag);
        }

        const controls = document.createElement("div");
        controls.className = "arrow-btns";
        [-1, 1].forEach(direction => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn-arrow";
          btn.textContent = direction < 0 ? "▲" : "▼";
          btn.disabled = !canEdit || lineIndex + direction < 0 || lineIndex + direction >= ordering.length;
          btn.setAttribute("aria-label", `${direction < 0 ? "Sposta in alto" : "Sposta in basso"}: ${lineTextValue}`);
          btn.addEventListener("click", () => moveLine(index, lineIndex, lineIndex + direction));
          controls.appendChild(btn);
        });

        lineItem.append(badge, content, controls);
        ui.linesList.appendChild(lineItem);
      });

      if (isVerified && ui.hasVerification) {
        ui.verificationSummary.textContent =
          `Correzione automatica: ${correctCount} di ${dialogue.correctOrder.length} battute al posto giusto`;
        ui.verificationSummary.hidden = false;
      } else {
        ui.verificationSummary.hidden = true;
      }
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

  window.ParloDialogueOrderExercise = Object.freeze({
    init: initDialogueOrderExercise
  });
})();