(() => {
  "use strict";

    const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBbOOnXPeSgqV_oT7uXdAEioU4Ha9nkbSY",
    authDomain: "esercizi-parlo-italiano.firebaseapp.com",
    databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esercizi-parlo-italiano",
    appId: "1:499443551452:web:0e05cb85de9f9ade897819"
  };

  const TEACHER_ID = "__teacher__";
  const SPECIAL_CHARS = ["'", "à", "è", "ì", "ò", "ù", "È"];

  function sanitizeId(raw) {
    return String(raw || "").trim().replace(/[.#$\/\[\]]/g, "_");
  }

  function applyUnitBackground() {
    const rootStyle = document.documentElement.style;
    const customBg = rootStyle.getPropertyValue("--es-a-bg").trim();
    const bgUrl = customBg || `url("${new URL("img/sfondo.jpeg", location.href).href}")`;
    rootStyle.setProperty("--es-a-bg", bgUrl);
  }

  function ensureCardChrome(card, exerciseKey) {
    let studentLogin = document.getElementById("student-login");
    if (!studentLogin) {
      studentLogin = document.createElement("div");
      studentLogin.className = "student-login";
      studentLogin.id = "student-login";
      studentLogin.innerHTML =
        `<label for="student-name">Ваше имя · Nome e cognome:</label>` +
        `<input id="student-name" type="text" placeholder="Inserisci il tuo nome per partecipare" />` +
        `<button id="confirm-student-name" type="button">Conferma</button>`;
      card.prepend(studentLogin);
    }

        let exerciseProgress = document.getElementById("exercise-progress");
    if (!exerciseProgress) {
      exerciseProgress = document.createElement("nav");
      exerciseProgress.id = "exercise-progress";
      exerciseProgress.className = "overall-progress";
      exerciseProgress.setAttribute("aria-label", "Vai direttamente alla scheda");
      studentLogin.after(exerciseProgress);
    }

    let refreshDistanceButton = document.getElementById("refresh-distance-data");
    if (!refreshDistanceButton) {
      refreshDistanceButton = document.createElement("button");
      refreshDistanceButton.id = "refresh-distance-data";
      refreshDistanceButton.type = "button";
      refreshDistanceButton.className = "btn-secondary";
      refreshDistanceButton.textContent = "Aggiorna dati dello studente";
      refreshDistanceButton.style.marginBottom = "12px";
      refreshDistanceButton.hidden = true;
      exerciseProgress.after(refreshDistanceButton);
    }

    let questionsContainer = document.getElementById("questions-container");
    if (!questionsContainer) {
      questionsContainer = document.createElement("div");
      questionsContainer.id = "questions-container";
      refreshDistanceButton.after(questionsContainer);
    }

    let slideNav = card.querySelector(".slide-navigation");
    if (!slideNav) {
      const unitPrefix = exerciseKey.replace(/_es_a$/i, "");
      const nextHref = document.body?.dataset?.nextHref || `${unitPrefix}_es_b.html`;
      const nextLabel = document.body?.dataset?.nextLabel || "Vai all’esercizio B →";

      slideNav = document.createElement("nav");
      slideNav.className = "slide-navigation student-navigation";
      slideNav.setAttribute("aria-label", "Navigazione schede");
      slideNav.innerHTML =
        `<button id="previous-question" type="button">← Precedente</button>` +
        `<span id="question-progress" class="slide-progress" aria-live="polite"></span>` +
        `<button id="next-question" type="button">Successiva →</button>` +
        `<a id="next-exercise" href="${nextHref}" hidden>${nextLabel}</a>`;
      questionsContainer.after(slideNav);
    }

    return {
      studentLogin,
      studentNameInput: document.getElementById("student-name"),
            confirmStudentNameBtn: document.getElementById("confirm-student-name"),
      refreshDistanceButton,
      questionsContainer,
      previousButton: document.getElementById("previous-question"),
      nextButton: document.getElementById("next-question"),
      progressText: document.getElementById("question-progress"),
      exerciseProgress,
      nextExerciseLink: document.getElementById("next-exercise")
    };
  }

  function initEsA(sectionsData) {
    const card = document.querySelector(".card");
    if (!card || !Array.isArray(sectionsData) || !sectionsData.length) return;

    applyUnitBackground();

        const session = window.ParloSession || {};
    const isTeacherView = Boolean(session.isTeacher);
    const activityMode = ["online", "distance", "individual"].includes(session.activityMode)
      ? session.activityMode
      : "online";
    const independentPractice = activityMode !== "online" && !isTeacherView;
    const gruppo = session.safeGroup || "sconosciuto";
    const rawPageKey = document.body?.dataset?.pageKey
      || location.pathname.split("/").pop()?.replace(/\.html?$/i, "")
      || "es_a";
    const exerciseKey = sanitizeId(rawPageKey) || "es_a";

    let currentUserName = isTeacherView
      ? "Insegnante"
      : ((session.name && session.name !== "Insegnante" ? session.name : "") || localStorage.getItem("parlo_student_name") || "").trim();

    let currentUserId = isTeacherView
      ? TEACHER_ID
      : (currentUserName ? `student_${sanitizeId(currentUserName)}` : "");

    const {
      studentLogin,
      studentNameInput,
            confirmStudentNameBtn,
      refreshDistanceButton,
      questionsContainer,
      previousButton,
      nextButton,
      progressText,
      exerciseProgress,
      nextExerciseLink
    } = ensureCardChrome(card, exerciseKey);

        let exerciseRef = null;
    let exerciseDataHandler = null;
    let exerciseLoadToken = 0;
    let databaseRef = null;
    let reviewStudentId = isTeacherView && activityMode === "distance"
      ? sanitizeId(window.ParloReviewStudentId || "").replace(/^student_/, "")
      : "";
    let presenceGroupRef = null;
    let cardsState = {};
    let rosterState = {};
    let activeQuestion = 0;
    const cardUI = [];
    const draftSyncTimers = new Map();

    function updateLoginVisibility() {
      studentLogin.classList.toggle("visible", !isTeacherView && !currentUserId);
    }
    updateLoginVisibility();

    confirmStudentNameBtn.addEventListener("click", () => {
      const entered = studentNameInput.value.trim();
      if (!entered) {
        studentNameInput.focus();
        return;
      }
      currentUserName = entered;
      currentUserId = `student_${sanitizeId(entered)}`;
      try { localStorage.setItem("parlo_student_name", entered); } catch (_) {}
      const badge = document.getElementById("user-badge");
      if (badge && session.group) {
        badge.textContent = `👤 ${session.group} · ${entered}`;
        badge.hidden = false;
      }
            updateLoginVisibility();
      registerPresence();
      connectExerciseData();
      renderAllCards();
    });

    studentNameInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        confirmStudentNameBtn.click();
      }
    });

    function createItalianCharToolbar(textarea) {
      const toolbar = document.createElement("div");
      toolbar.className = "accent-toolbar";
      toolbar.setAttribute("aria-label", "Caratteri speciali italiani");
      SPECIAL_CHARS.forEach(char => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = char;
        btn.setAttribute("aria-label", `Inserisci ${char}`);
        btn.addEventListener("mousedown", e => e.preventDefault());
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
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch (_) {
        return "";
      }
    }

    function getParticipantName(assigneeId) {
      if (!assigneeId) return "Nessuno";
      if (assigneeId === TEACHER_ID) return "Insegnante";
      const entry = rosterState[assigneeId];
      if (entry && entry.name) return entry.name;
      return assigneeId.replace(/^student_/, "").replace(/_/g, " ");
    }

    function getParticipantLabel(assigneeId) {
      if (!assigneeId) return "Nessuno";
      if (assigneeId === TEACHER_ID) return "👩‍🏫 Insegnante";
      const entry = rosterState[assigneeId];
      if (entry && entry.name) {
        return `${entry.online ? "🟢" : "⚪"} ${entry.name}`;
      }
      return assigneeId.replace(/^student_/, "").replace(/_/g, " ");
    }

    function buildTurnOptions(selectEl, selectedValue) {
      const previous = selectedValue ?? selectEl.value ?? "";
      selectEl.replaceChildren();

      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = "— Nessuno —";
      selectEl.appendChild(emptyOpt);

      const teacherOpt = document.createElement("option");
      teacherOpt.value = TEACHER_ID;
      teacherOpt.textContent = "👩‍🏫 Insegnante";
      selectEl.appendChild(teacherOpt);

      const students = Object.entries(rosterState)
        .filter(([id, data]) => id !== TEACHER_ID && data && data.name)
        .sort((a, b) => {
          const onlineDiff = Number(Boolean(b[1].online)) - Number(Boolean(a[1].online));
          if (onlineDiff !== 0) return onlineDiff;
          return String(a[1].name).localeCompare(String(b[1].name), "it");
        });

      students.forEach(([id, data]) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = `${data.online ? "🟢" : "⚪"} ${data.name}`;
        selectEl.appendChild(opt);
      });

      if (previous && !Array.from(selectEl.options).some(o => o.value === previous)) {
        const fallbackOpt = document.createElement("option");
        fallbackOpt.value = previous;
        fallbackOpt.textContent = `⚪ ${previous.replace(/^student_/, "").replace(/_/g, " ")}`;
        selectEl.appendChild(fallbackOpt);
      }

      selectEl.value = previous;
    }

    function notifyClassroomNotesScope(index) {
      const question = sectionsData[index];
      window.ParloNotesScope = {
        group: gruppo,
        exercise: exerciseKey,
        card: `card_${index}`,
        cardLabel: question?.hint || `Scheda ${index + 1}`
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", {
        detail: window.ParloNotesScope
      }));
    }

        function syncDraftToFirebase(index, text) {
      cardsState[index] = { ...(cardsState[index] || {}), draftQuestion: text };
      updateNavigation();
      if (!exerciseRef) return;
      clearTimeout(draftSyncTimers.get(index));
      draftSyncTimers.set(index, setTimeout(() => {
        draftSyncTimers.delete(index);
        exerciseRef.child("cards").child(String(index)).child("draftQuestion").set(text);
      }, 150));
    }

    function ensureQuestionMark(rawText) {
      const cleaned = rawText.trim().replace(/\s+/g, " ");
      if (!cleaned) return "";
      return /[?!.]$/.test(cleaned) ? cleaned : `${cleaned}?`;
    }

    async function commitPendingDraftAndChangeAssignee(index, nextAssigneeId) {
      if (!exerciseRef) return;
      const cardData = cardsState[index] || {};
      const prevAssigneeId = cardData.questionAssignee || "";

      if (prevAssigneeId && prevAssigneeId !== nextAssigneeId) {
        const rawDraft = (cardData.draftQuestion || "").trim();
        const formatted = ensureQuestionMark(rawDraft);
        const cardRef = exerciseRef.child("cards").child(String(index));

        if (formatted) {
          await cardRef.child("contributions").push().set({
            text: formatted,
            authorId: prevAssigneeId,
            authorName: getParticipantName(prevAssigneeId),
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });
        }
        await cardRef.update({
          draftQuestion: "",
          questionAssignee: nextAssigneeId || null
        });
      } else {
        await exerciseRef.child("cards").child(String(index)).child("questionAssignee").set(nextAssigneeId || null);
      }
    }

    questionsContainer.replaceChildren();
    sectionsData.forEach((question, index) => {
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
      const hintTitleSpan = document.createElement("span");
      hintTitleSpan.textContent = `${question.hint}...`;
      title.append(numSpan, hintTitleSpan);

            const turnStatusRow = document.createElement("div");
      turnStatusRow.className = "turn-status-row";
      turnStatusRow.hidden = independentPractice;
      const askPill = document.createElement("span");
      askPill.className = "turn-pill";
      const answerPill = document.createElement("span");
      answerPill.className = "turn-pill";
      turnStatusRow.append(askPill, answerPill);

      header.append(title, turnStatusRow);

            const assignmentBar = document.createElement("div");
      assignmentBar.className = "turn-assignment-bar";
      assignmentBar.hidden = !isTeacherView || independentPractice;

      const askGroup = document.createElement("div");
      askGroup.className = "turn-select-group";
      const askLabel = document.createElement("label");
      askLabel.htmlFor = `assign-ask-${index}`;
      askLabel.textContent = "✍️ Turno domanda:";
      const askSelect = document.createElement("select");
      askSelect.id = `assign-ask-${index}`;
      if (isTeacherView) {
                askSelect.addEventListener("change", () => {
          if (reviewStudentId) return;
          commitPendingDraftAndChangeAssignee(index, askSelect.value);
        });

      }
      askGroup.append(askLabel, askSelect);

      const answerGroup = document.createElement("div");
      answerGroup.className = "turn-select-group";
      const answerLabel = document.createElement("label");
      answerLabel.htmlFor = `assign-answer-${index}`;
      answerLabel.textContent = "✅ Turno risposta:";
      const answerSelect = document.createElement("select");
      answerSelect.id = `assign-answer-${index}`;
      if (isTeacherView) {
                answerSelect.addEventListener("change", () => {
          if (!exerciseRef || reviewStudentId) return;

          exerciseRef.child("cards").child(String(index)).child("answerAssignee").set(answerSelect.value || null);
        });
      }
      answerGroup.append(answerLabel, answerSelect);

      if (isTeacherView) {
        assignmentBar.append(askGroup, answerGroup);
      }

      const questionCard = document.createElement("div");
      questionCard.className = "question-form-card";

      const questionHeader = document.createElement("div");
      questionHeader.className = "question-form-header";
      const questionLabel = document.createElement("label");
            questionLabel.htmlFor = `question-input-${index}`;
      questionLabel.textContent = activityMode === "distance"
        ? (isTeacherView ? "✍️ Domanda dello studente:" : "✍️ La tua domanda:")
        : "✍️ Formula una domanda:";
      const questionTurnHint = document.createElement("span");
      questionTurnHint.className = "turn-hint-tag";
      questionHeader.append(questionLabel, questionTurnHint);

      const questionInput = document.createElement("textarea");
      questionInput.id = `question-input-${index}`;
      questionInput.className = "question-input";
      questionInput.rows = 2;
      questionInput.placeholder = "Scrivi qui la domanda...";
      questionInput.disabled = true;

            const accentToolbar = createItalianCharToolbar(questionInput);

      let teacherFeedbackPanel = null;
      let feedbackEditor = null;
      let feedbackStatus = null;
      let studentFeedbackPanel = null;
      let studentFeedbackText = null;

      if (isTeacherView && activityMode === "distance") {
        teacherFeedbackPanel = document.createElement("section");
        teacherFeedbackPanel.className = "es-a-teacher-feedback";
        teacherFeedbackPanel.hidden = !reviewStudentId;
        const feedbackTitle = document.createElement("h3");
        feedbackTitle.textContent = "👩‍🏫 Revisione della domanda";
        const goalText = document.createElement("p");
        goalText.className = "es-a-feedback-goal";
        goalText.textContent = `Obiettivo della scheda: ${question.questionGoal || "Non specificato"}`;
        const generateFeedbackButton = document.createElement("button");
        generateFeedbackButton.type = "button";
        generateFeedbackButton.className = "es-a-feedback-button";
        generateFeedbackButton.textContent = "✨ Genera feedback con l’IA";
        feedbackEditor = document.createElement("textarea");
        feedbackEditor.className = "es-a-feedback-editor";
        feedbackEditor.rows = 8;
        feedbackEditor.placeholder = "Incolla qui il feedback generato, controllalo e poi salvalo per lo studente.";
        feedbackEditor.setAttribute("aria-label", "Feedback approvato dall’insegnante");
        const saveFeedbackButton = document.createElement("button");
        saveFeedbackButton.type = "button";
        saveFeedbackButton.className = "es-a-feedback-button es-a-feedback-save";
        saveFeedbackButton.textContent = "💾 Salva feedback per lo studente";
        feedbackStatus = document.createElement("p");
        feedbackStatus.className = "es-a-feedback-status";
        generateFeedbackButton.addEventListener("click", async () => {
          const endpoint = String(window.PARLO_AI_REVIEW_URL || "").trim();
          console.info("[AI review] Click sul pulsante", {
            endpointConfigured: Boolean(endpoint),
            teacherView: isTeacherView,
            activityMode,
            reviewStudentSelected: Boolean(reviewStudentId)
          });
          if (!endpoint) {
            feedbackStatus.textContent = "Il Worker non è ancora configurato. Segui le istruzioni in cloudflare/README.md.";
            return;
          }
          const studentQuestion = String((cardsState[index] || {}).draftQuestion || questionInput.value || "").trim();
          if (!studentQuestion) {
            feedbackStatus.textContent = "Lo studente non ha ancora scritto una domanda da revisionare.";
            return;
          }
          const authFactory = window.firebase?.auth;
          if (typeof authFactory !== "function") {
            feedbackStatus.textContent = "Accesso Google docente non disponibile. Torna alla pagina iniziale, accedi di nuovo e ricarica questa pagina.";
            return;
          }

          generateFeedbackButton.disabled = true;
          feedbackStatus.textContent = "Verifica dell’accesso docente…";
          try {
            const auth = authFactory.call(window.firebase);
            let user = auth.currentUser;
            if (!user) {
              user = await new Promise(resolve => {
                let unsubscribe = () => {};
                let settled = false;
                const finish = currentUser => {
                  if (settled) return;
                  settled = true;
                  clearTimeout(timeoutId);
                  unsubscribe();
                  resolve(currentUser);
                };
                const timeoutId = setTimeout(() => finish(null), 8000);
                unsubscribe = auth.onAuthStateChanged(finish, () => finish(null));
              });
            }
            if (!user) {
              throw new Error("Accesso Google docente non disponibile. Torna alla pagina iniziale, accedi di nuovo e ricarica questa pagina.");
            }
            feedbackStatus.textContent = "Invio della richiesta e generazione del feedback…";
            const idToken = await user.getIdToken();
            console.info("[AI review] Invio POST al Worker", new URL(endpoint).origin + new URL(endpoint).pathname);
            const response = await fetch(endpoint, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${idToken}`
              },
              body: JSON.stringify({
                context: question.hint,
                goal: question.questionGoal || "Non specificato",
                options: question.options,
                correctOption: question.correctOption,
                studentQuestion
              })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || "Impossibile generare il feedback.");
            feedbackEditor.value = String(result.feedback || "");
            feedbackStatus.textContent = "Feedback IA pronto. Controllalo e correggilo, se serve, prima di salvarlo per lo studente.";
            feedbackEditor.focus();
          } catch (error) {
            console.error("[AI review] Richiesta non completata", error);
            feedbackStatus.textContent = error?.message || "Servizio IA non disponibile. Riprova più tardi.";
          } finally {
            generateFeedbackButton.disabled = false;
          }
        });
        saveFeedbackButton.addEventListener("click", async () => {
          if (!exerciseRef || !reviewStudentId) {
            feedbackStatus.textContent = "Seleziona prima uno studente da revisionare.";
            return;
          }
          saveFeedbackButton.disabled = true;
          try {
            const feedback = {
              text: feedbackEditor.value.trim(),
              updatedAt: Date.now(),
              teacher: String(session.teacherName || session.name || "Insegnante")
            };
            await exerciseRef.child("cards").child(String(index)).child("teacherFeedback").set(feedback);
            cardsState[index] = { ...(cardsState[index] || {}), teacherFeedback: feedback };
            feedbackStatus.textContent = feedback.text ? "Feedback salvato: sarà visibile allo studente." : "Feedback rimosso.";
          } catch (_) {
            feedbackStatus.textContent = "Errore: impossibile salvare il feedback.";
          } finally {
            saveFeedbackButton.disabled = false;
          }
        });
        teacherFeedbackPanel.append(feedbackTitle, goalText, generateFeedbackButton, feedbackEditor, saveFeedbackButton, feedbackStatus);
      } else if (!isTeacherView && activityMode === "distance") {
        studentFeedbackPanel = document.createElement("section");
        studentFeedbackPanel.className = "es-a-student-feedback";
        studentFeedbackPanel.hidden = true;
        const feedbackTitle = document.createElement("h3");
        feedbackTitle.textContent = "👩‍🏫 Feedback dell’insegnante";
        studentFeedbackText = document.createElement("p");
        studentFeedbackText.className = "es-a-student-feedback-text";
        studentFeedbackPanel.append(feedbackTitle, studentFeedbackText);
      }

            questionInput.addEventListener("input", () => {
        const cardData = cardsState[index] || {};
        if (reviewStudentId || !currentUserId || (!independentPractice && cardData.questionAssignee !== currentUserId)) return;

        syncDraftToFirebase(index, questionInput.value);
      });

      const submitRow = document.createElement("div");
      submitRow.className = "question-submit-row";

      const submitBtn = document.createElement("button");
      submitBtn.type = "button";
      submitBtn.className = "btn-submit-question";
      submitBtn.textContent = "📤 Invia domanda";
      submitBtn.disabled = true;

            submitBtn.addEventListener("click", async () => {
        const cardData = cardsState[index] || {};
        if (reviewStudentId || !exerciseRef || !currentUserId || (!independentPractice && cardData.questionAssignee !== currentUserId)) return;

        const formatted = ensureQuestionMark(questionInput.value);
        if (!formatted) {
          questionInput.focus();
          return;
        }
        clearTimeout(draftSyncTimers.get(index));
        draftSyncTimers.delete(index);

        const cardRef = exerciseRef.child("cards").child(String(index));
        await cardRef.child("contributions").push().set({
          text: formatted,
          authorId: currentUserId,
          authorName: isTeacherView ? "Insegnante" : currentUserName,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        await cardRef.child("draftQuestion").set("");
        questionInput.value = "";
        questionInput.focus();
      });

            submitBtn.hidden = activityMode === "distance";
      submitRow.hidden = activityMode === "distance";
            questionCard.append(questionHeader, accentToolbar, questionInput, submitRow);

      const contributionsWrapper = document.createElement("div");
      contributionsWrapper.className = "contributions-wrapper";
      const contributionsTitle = document.createElement("div");
      contributionsTitle.className = "contributions-title";
      contributionsTitle.textContent = independentPractice
        ? "💬 Le mie domande"
        : "💬 Domande inviate";
      const contributionsEmpty = document.createElement("p");
      contributionsEmpty.className = "contributions-empty";
      contributionsEmpty.textContent = "Nessuna domanda inviata per questa scheda.";
      const contributionsList = document.createElement("div");
      contributionsList.className = "contributions-list";
            contributionsWrapper.append(contributionsTitle, contributionsEmpty, contributionsList);
      contributionsWrapper.hidden = activityMode === "distance";

      const optionsSection = document.createElement("div");
      optionsSection.className = "options-section";
      const hint = document.createElement("div");
      hint.className = "section-hint";
      hint.textContent = `${question.hint}...`;

      const optionsGrid = document.createElement("div");
      optionsGrid.className = "options-grid";

      const optionButtons = question.options.map((optionText, optionIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-btn";
        button.disabled = true;

        const mainSpan = document.createElement("span");
        mainSpan.className = "option-main";
        const letterSpan = document.createElement("span");
        letterSpan.className = "option-letter";
        letterSpan.textContent = String.fromCharCode(65 + optionIndex);
        const textSpan = document.createElement("span");
        textSpan.textContent = optionText;
        mainSpan.append(letterSpan, textSpan);

        const badgeSpan = document.createElement("span");
        badgeSpan.className = "option-feedback-badge";
        button.append(mainSpan, badgeSpan);

                                button.addEventListener("click", () => {
                    const cardData = cardsState[index] || {};
          if (reviewStudentId || !exerciseRef || !currentUserId || (!independentPractice && cardData.answerAssignee !== currentUserId)) return;

          const answerUpdate = {
            selectedOption: optionIndex,
            answeredBy: isTeacherView ? "Insegnante" : currentUserName,
            answeredAt: firebase.database.ServerValue.TIMESTAMP
          };
          exerciseRef.child("cards").child(String(index)).update(answerUpdate);
          if (activityMode === "distance") {
            cardsState[index] = { ...cardData, ...answerUpdate, answeredAt: Date.now() };
            renderCard(index);
            updateNavigation();
          }
        });

        optionsGrid.appendChild(button);
        return { button, badgeSpan };
      });

      const answerOutcome = document.createElement("p");
      answerOutcome.className = "answer-outcome";
      answerOutcome.hidden = true;
      answerOutcome.setAttribute("aria-live", "polite");

      optionsSection.append(hint, optionsGrid, answerOutcome);

            box.append(header);
      if (isTeacherView) box.append(assignmentBar);
      box.append(questionCard);
      if (teacherFeedbackPanel) box.append(teacherFeedbackPanel);
      if (studentFeedbackPanel) box.append(studentFeedbackPanel);
      box.append(contributionsWrapper, optionsSection);

      questionsContainer.appendChild(box);

      cardUI.push({
                box,
        assignmentBar,
        askSelect,
        answerSelect,

        askPill,
        answerPill,
                questionCard,
        teacherFeedbackPanel,
        feedbackEditor,
        feedbackStatus,
        studentFeedbackPanel,
        studentFeedbackText,
        questionTurnHint,
        accentToolbar,
        questionInput,
        submitBtn,
        contributionsEmpty,
        contributionsList,
        optionsSection,
        optionButtons,
        answerOutcome
      });
    });

    exerciseProgress.replaceChildren();
    sectionsData.forEach((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "progress-step";
      button.textContent = String(index + 1);
      button.setAttribute("aria-label", `Vai alla scheda ${index + 1}`);
      button.setAttribute("aria-current", index === activeQuestion ? "step" : "false");
      button.addEventListener("click", () => showQuestion(index));
      exerciseProgress.appendChild(button);
    });

    function updateNavigation() {
      const last = activeQuestion === sectionsData.length - 1;
      previousButton.disabled = activeQuestion === 0;
      nextButton.hidden = last;
      nextExerciseLink.hidden = !last;

      exerciseProgress.querySelectorAll(".progress-step").forEach((button, index) => {
        const cardData = cardsState[index] || {};
                const hasContribution = activityMode === "distance"
          ? Boolean(String(cardData.draftQuestion || "").trim())
          : Boolean(cardData.contributions && Object.keys(cardData.contributions).length > 0);
        const hasAnswer = cardData.selectedOption !== undefined && cardData.selectedOption !== null;
        const isAnswerCorrect = hasAnswer && Number(cardData.selectedOption) === sectionsData[index].correctOption;

        const isDone = hasContribution && isAnswerCorrect;
        const isPartial = !isDone && (hasContribution || hasAnswer);

        button.classList.toggle("done", isDone);
        button.classList.toggle("partial", isPartial);
        button.setAttribute("aria-current", index === activeQuestion ? "step" : "false");
      });

      progressText.textContent = `Scheda ${activeQuestion + 1} di ${sectionsData.length}`;
    }

    function showQuestion(index) {
      activeQuestion = Math.max(0, Math.min(index, sectionsData.length - 1));
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
      if (event.key === "ArrowRight" && activeQuestion < sectionsData.length - 1) showQuestion(activeQuestion + 1);
    });

    function renderCard(index) {
      const ui = cardUI[index];
      const question = sectionsData[index];
      const cardData = cardsState[index] || {};

            const questionAssignee = cardData.questionAssignee || "";
      const answerAssignee = cardData.answerAssignee || "";
                  const canEditQuestion = !reviewStudentId && (independentPractice
        ? Boolean(currentUserId)
        : Boolean(currentUserId && questionAssignee === currentUserId));
      const canChooseAnswer = !reviewStudentId && (independentPractice
        ? Boolean(currentUserId)
        : Boolean(currentUserId && answerAssignee === currentUserId));

      if (isTeacherView) {
        ui.assignmentBar.hidden = Boolean(independentPractice || reviewStudentId);
        ui.askSelect.disabled = Boolean(reviewStudentId);
        ui.answerSelect.disabled = Boolean(reviewStudentId);
        buildTurnOptions(ui.askSelect, questionAssignee);
        buildTurnOptions(ui.answerSelect, answerAssignee);
      }


      ui.askPill.textContent = `✍️ Domanda: ${getParticipantLabel(questionAssignee)}`;
      ui.askPill.classList.toggle("is-me", canEditQuestion);

      ui.answerPill.textContent = `✅ Risposta: ${getParticipantLabel(answerAssignee)}`;
      ui.answerPill.classList.toggle("is-me", canChooseAnswer);

      ui.questionCard.classList.toggle("active-turn", canEditQuestion);
      ui.optionsSection.classList.toggle("active-turn", canChooseAnswer);

            ui.questionTurnHint.textContent = independentPractice
        ? "Esercizio personale"
        : canEditQuestion
          ? "È il tuo turno di scrivere"
          : questionAssignee
            ? `In turno: ${getParticipantLabel(questionAssignee)}`
            : "In attesa di assegnazione";

      const remoteDraft = cardData.draftQuestion || "";
      if (!canEditQuestion || document.activeElement !== ui.questionInput) {
        if (ui.questionInput.value !== remoteDraft) {
          ui.questionInput.value = remoteDraft;
        }
      }
      ui.questionInput.disabled = !canEditQuestion;
      ui.accentToolbar.querySelectorAll("button").forEach(btn => {
        btn.disabled = !canEditQuestion;
      });
      ui.submitBtn.disabled = !canEditQuestion;

      const rawContributions = cardData.contributions || {};
      const contributions = Object.entries(rawContributions)
        .map(([id, item]) => ({ id, ...(item || {}) }))
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      ui.contributionsList.replaceChildren();
      ui.contributionsEmpty.hidden = contributions.length > 0;

      contributions.forEach(item => {
        const contributionCard = document.createElement("div");
        contributionCard.className = "contribution-item";

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
        timeSpan.textContent = formatTimestamp(item.timestamp);
        metaEl.append(authorSpan, timeSpan);

        body.append(textEl, metaEl);
        contributionCard.appendChild(body);

                if (isTeacherView && !reviewStudentId) {
          const delBtn = document.createElement("button");

          delBtn.type = "button";
          delBtn.className = "btn-delete-contribution";
          delBtn.textContent = "✕";
          delBtn.title = "Elimina questa domanda";
          delBtn.setAttribute("aria-label", "Elimina questa domanda");
          delBtn.addEventListener("click", () => {
            if (!exerciseRef) return;
            exerciseRef.child("cards").child(String(index)).child("contributions").child(item.id).remove();
          });
          contributionCard.appendChild(delBtn);
        }

        ui.contributionsList.appendChild(contributionCard);
      });

      const selectedOption = cardData.selectedOption;
      const hasSelection = selectedOption !== undefined && selectedOption !== null;

      ui.optionButtons.forEach(({ button, badgeSpan }, optIndex) => {
        const isSelected = hasSelection && Number(selectedOption) === optIndex;
        const isCorrect = optIndex === question.correctOption;

        button.disabled = !canChooseAnswer;
        button.classList.toggle("selected", isSelected);
        button.classList.toggle("correct", isSelected && isCorrect);
        button.classList.toggle("incorrect", isSelected && !isCorrect);

        if (isSelected) {
          badgeSpan.textContent = isCorrect ? "✓ Corretta" : "✕ Errata";
        } else {
          badgeSpan.textContent = "";
        }
      });

            if (hasSelection) {
        const isCorrect = Number(selectedOption) === question.correctOption;
        const who = cardData.answeredBy ? ` (${cardData.answeredBy})` : "";
        ui.answerOutcome.hidden = false;
        ui.answerOutcome.className = `answer-outcome ${isCorrect ? "correct" : "incorrect"}`;
        ui.answerOutcome.textContent = isCorrect
          ? `✅ Risposta corretta${who}!`
          : `❌ Risposta non corretta${who}.`;
      } else {
        ui.answerOutcome.hidden = true;
      }

      const savedFeedback = cardData.teacherFeedback || {};
      if (ui.teacherFeedbackPanel) {
        ui.teacherFeedbackPanel.hidden = !reviewStudentId;
        if (document.activeElement !== ui.feedbackEditor) {
          ui.feedbackEditor.value = String(savedFeedback.text || "");
        }
        if (savedFeedback.updatedAt && !ui.feedbackStatus.textContent.startsWith("Prompt")) {
          ui.feedbackStatus.textContent = `Feedback salvato${savedFeedback.teacher ? ` da ${savedFeedback.teacher}` : ""}.`;
        } else if (!savedFeedback.text && !ui.feedbackStatus.textContent.startsWith("Prompt")) {
          ui.feedbackStatus.textContent = "";
        }
      }
      if (ui.studentFeedbackPanel) {
        ui.studentFeedbackPanel.hidden = !String(savedFeedback.text || "").trim();
        ui.studentFeedbackText.textContent = String(savedFeedback.text || "");
      }
    }

    function renderAllCards() {
      sectionsData.forEach((_, index) => renderCard(index));
      updateNavigation();
    }

        function connectExerciseData() {
      if (!databaseRef || (independentPractice && !currentUserId)) return;
      if (exerciseRef && exerciseDataHandler) {
        exerciseRef.off("value", exerciseDataHandler);
      }
      const sharedExercisePath = `esercizi/gruppi/${gruppo}/${exerciseKey}`;
      const studentExercisePath = isTeacherView && activityMode === "distance" && reviewStudentId
        ? `${sharedExercisePath}/distance/students/student_${reviewStudentId}`
        : independentPractice
          ? `${sharedExercisePath}/${activityMode}/students/${currentUserId}`
          : sharedExercisePath;
            const loadToken = ++exerciseLoadToken;
      exerciseRef = databaseRef.ref(studentExercisePath);
      const targetRef = exerciseRef;
      exerciseDataHandler = snapshot => {
        if (loadToken !== exerciseLoadToken) return;
        const data = snapshot.val() || {};
        cardsState = data.cards || {};
        renderAllCards();
      };

      if (activityMode === "distance") {
        exerciseDataHandler = null;
        targetRef.once("value").then(snapshot => {
          if (loadToken !== exerciseLoadToken || exerciseRef !== targetRef) return;
          const data = snapshot.val() || {};
          cardsState = data.cards || {};
          renderAllCards();
        }).catch(error => console.error("Errore nel caricamento dei dati dello studente:", error));
      } else {
        targetRef.on("value", exerciseDataHandler);
      }
    }

    refreshDistanceButton.hidden = !(isTeacherView && activityMode === "distance");
    refreshDistanceButton.addEventListener("click", () => {
      if (isTeacherView && activityMode === "distance") connectExerciseData();
    });

    if (isTeacherView && activityMode === "distance") {
      window.addEventListener("parlo:review-student-changed", event => {
        reviewStudentId = sanitizeId(event.detail?.studentId || "").replace(/^student_/, "");
        connectExerciseData();
        renderAllCards();
      });
    }

    function registerPresence() {
      if (!presenceGroupRef || isTeacherView || !currentUserId || !currentUserName) return;
      const myPresenceRef = presenceGroupRef.child(currentUserId);
      const connectedRef = firebase.database().ref(".info/connected");
      connectedRef.on("value", snap => {
        if (snap.val() === true) {
          myPresenceRef.onDisconnect().update({
            online: false,
            lastSeen: firebase.database.ServerValue.TIMESTAMP
          });
          myPresenceRef.update({
            name: currentUserName,
            online: true,
            lastSeen: firebase.database.ServerValue.TIMESTAMP
          });
        }
      });
    }

    if (window.firebase) {
      try {
        if (window.ParloModes && typeof window.ParloModes.initFirebase === "function") {
          window.ParloModes.initFirebase();
        } else if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
                databaseRef = firebase.database();

        if (activityMode === "online") {
          presenceGroupRef = databaseRef.ref(`esercizi/gruppi/${gruppo}/presenze`);
          presenceGroupRef.on("value", snapshot => {
            rosterState = snapshot.val() || {};
            renderAllCards();
          });
        }

        connectExerciseData();
        registerPresence();
      } catch (error) {
        console.error("Errore Firebase:", error);
      }
    }

    renderAllCards();
    showQuestion(0);

    if (window.ParloExercise) {
      ParloExercise.initBackgroundParallax();
      ParloExercise.decorateSessionLinks();
      const exMenu = document.getElementById("exercise-menu");
      const grMenu = document.getElementById("grammar-menu");
      if (exMenu) ParloExercise.bindNavigationSelect(exMenu);
      if (grMenu) ParloExercise.bindNavigationSelect(grMenu);
    }
  }

  window.ParloEsA = Object.freeze({ init: initEsA });

  // Avvio automatico se l'HTML espone window.ES_A_DATA
  function autoBoot() {
    if (Array.isArray(window.ES_A_DATA)) {
      initEsA(window.ES_A_DATA);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
  } else {
    autoBoot();
  }
})();