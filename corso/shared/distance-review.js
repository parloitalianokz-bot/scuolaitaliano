/* Revisione per scheda, condivisa in tempo reale tra insegnante e studente. */
(() => {
  "use strict";

  if (window.__parloDistanceReviewLoaded) return;
  window.__parloDistanceReviewLoaded = true;

  const session = window.ParloSession || {};
  if (session.activityMode !== "distance" || !session.safeGroup || session.safeGroup === "sconosciuto") return;

  const isTeacher = Boolean(session.isTeacher);
  const safeGroup = String(session.safeGroup).replace(/[.#$\/\[\]]/g, "_");
  const exercise = String(
    document.body?.dataset?.pageKey || location.pathname.split("/").pop()?.replace(/\.html?$/i, "") || "attivita"
  ).replace(/[.#$\/\[\]]/g, "_");
  if (/(?:^|\/)\d{3}_lettura\.html?$/i.test(location.pathname)) return;
  const unitMatch = location.pathname.match(/(?:^|\/)u_(\d{3})(?:\/|$)/i);
  const unit = unitMatch ? `unita_${Number(unitMatch[1])}` : "unita_0";
  const studentId = String(session.studentId || session.name || "").trim().replace(/[.#$\/\[\]]/g, "_");
  const answerSelector = document.body?.dataset?.reviewAnswerSelector || ".answer-form-card";
  const commentPlacement = document.body?.dataset?.reviewCommentPlacement || "answer";
  const reviewItemLabel = document.body?.dataset?.reviewItemLabel || "risposta";
  const reviewItemLabelCapitalized = reviewItemLabel.charAt(0).toUpperCase() + reviewItemLabel.slice(1);
  const usesLegacyDistancePath = /_es_a$/i.test(exercise);
  const storageStudentId = usesLegacyDistancePath ? `student_${studentId}` : studentId;
  if (!isTeacher && !studentId) return;

  function init() {
    let db = null;
    try {
      db = window.ParloModes?.initFirebase?.();
      if (!db && window.firebase) {
        if (!firebase.apps.length) {
          firebase.initializeApp({
            authDomain: "esercizi-parlo-italiano.firebaseapp.com",
            databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "esercizi-parlo-italiano"
          });
        }
        db = firebase.database();
      }
    } catch (error) {
      console.error("Impossibile inizializzare la revisione a distanza:", error);
    }
    if (!db) return;

    const dataBranch = usesLegacyDistancePath ? "distance" : "distanceData";
    const answersRef = db.ref(`esercizi/gruppi/${safeGroup}/${exercise}/${dataBranch}`);
    const reviewBase = db.ref(`esercizi/gruppi/${safeGroup}/revisioni/${unit}/${exercise}`);
    const style = document.createElement("style");
    style.textContent = `
      .parlo-distance-review-sheet { margin:18px 0 4px; padding:14px; border:1px solid #c7d8c8; border-left:5px solid #477755; border-radius:12px; background:#f8fbf7; color:#292d28; font: .94rem/1.5 'Segoe UI',Inter,system-ui,sans-serif; }
      .parlo-distance-review-sheet h3 { margin:0 0 8px; color:#2f5739; font-size:1rem; }
      .parlo-distance-review-sheet textarea { display:block; width:100%; min-height:90px; margin-top:8px; padding:9px 10px; border:1px solid #d4e1d5; border-radius:9px; background:white; color:inherit; font:inherit; resize:vertical; }
      .parlo-distance-review-sheet textarea[readonly] { background:#f2f4f0; }
      .parlo-distance-review-status { margin:6px 0; font-weight:800; }
      .parlo-distance-review-status.approved { color:#187341; }
      .parlo-distance-review-status.rejected { color:#b42318; }
      .parlo-distance-review-status.pending { color:#6b7069; }
      .parlo-distance-review-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:9px; }
      .parlo-distance-review-actions button { min-height:38px; padding:7px 11px; border:0; border-radius:9px; color:white; font:inherit; font-weight:700; cursor:pointer; }
      .parlo-distance-review-save { background:#2f5739; }
      .parlo-distance-review-approve { background:#187341; }
      .parlo-distance-review-reject { background:#b42318; }
      .parlo-distance-review-pending { background:#68716a; }
      .parlo-distance-review-actions button:disabled { opacity:.55; cursor:wait; }
      .parlo-distance-review-answer-actions { align-items:center; padding-top:10px; border-top:1px solid #e3e9e2; }
      .parlo-distance-review-answer-actions .parlo-distance-review-status { flex:1 1 100%; }
      .parlo-distance-review-controls { display:flex; flex-wrap:wrap; gap:8px; }
      .parlo-distance-review-answer.review-approved { border-color:#187341!important; background:#f0faf3!important; box-shadow:0 0 0 2px rgba(24,115,65,.12); }
      .parlo-distance-review-answer.review-rejected { border-color:#b42318!important; background:#fff4f2!important; box-shadow:0 0 0 2px rgba(180,35,24,.12); }
      .parlo-distance-review-meta { margin:7px 0 0; color:#6b7069; font-size:.8rem; }
    `;
    document.head.appendChild(style);

    let selectedStudentId = "";
    if (isTeacher) {
      try {
        selectedStudentId = String(
          window.ParloReviewStudentId || sessionStorage.getItem(`parlo_review_student_${safeGroup}`) || ""
        ).replace(/^student_/, "");
      } catch (_) {
        selectedStudentId = String(window.ParloReviewStudentId || "").replace(/^student_/, "");
      }
    }
    let activeAnswerCard = null;
    let activeReviewRef = null;
    let reviewListener = null;
    let reviewRecord = {};
    let isDirty = false;
    let saving = false;
    let commentSaveTimer = null;

    const reviewBox = document.createElement("section");
    reviewBox.className = "parlo-distance-review-sheet";
    reviewBox.setAttribute("aria-label", "Commento e approvazione dell’insegnante");
    const title = document.createElement("h3");
    title.textContent = "👩‍🏫 Revisione dell’insegnante";
    const status = document.createElement("p");
    status.className = "parlo-distance-review-status pending";
    const comment = document.createElement("textarea");
    comment.setAttribute("aria-label", "Commento dell’insegnante");
    comment.readOnly = !isTeacher;
    comment.placeholder = isTeacher ? "Scrivi un commento per questa scheda…" : "Nessun commento per questa scheda.";
    const meta = document.createElement("p");
    meta.className = "parlo-distance-review-meta";
    const actions = document.createElement("div");
    actions.className = "parlo-distance-review-actions";
    const saveButton = makeButton("💾 Salva commento", "parlo-distance-review-save");
    if (isTeacher) actions.append(saveButton);

    const answerActions = document.createElement("div");
    answerActions.className = "parlo-distance-review-actions parlo-distance-review-answer-actions";
    const answerControls = document.createElement("div");
    answerControls.className = "parlo-distance-review-controls";
    const approveButton = makeButton(`✅ Approva ${reviewItemLabel}`, "parlo-distance-review-approve");
    const rejectButton = makeButton("❌ Non approvare", "parlo-distance-review-reject");
    const pendingButton = makeButton("↩ In attesa", "parlo-distance-review-pending");
    if (isTeacher) answerControls.append(approveButton, rejectButton, pendingButton);
    answerControls.hidden = !isTeacher;
    answerActions.append(status, answerControls);
    reviewBox.append(title, comment, meta, actions);

    function makeButton(text, className) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.textContent = text;
      return button;
    }

    function resolveScope(scope = window.ParloNotesScope || {}) {
      const rawCard = String(scope.reviewCard || scope.card || "scheda_unica").replace(/[.#$\/\[\]]/g, "_");
      const cardLabel = String(scope.cardLabel || "").trim();
      const fallbackCard = document.querySelectorAll(".section-box").length
        ? `card_${Array.from(document.querySelectorAll(".section-box")).findIndex(node => !node.hidden)}`
        : "scheda_unica";
      return {
        group: String(scope.group || safeGroup).replace(/[.#$\/\[\]]/g, "_"),
        exercise: String(scope.exercise || exercise).replace(/[.#$\/\[\]]/g, "_"),
        card: scope.card ? rawCard : fallbackCard,
        cardLabel
      };
    }

    function getTargetContainer() {
      return document.querySelector(`.section-box:not([hidden]) ${answerSelector}`) ||
        document.querySelector(".section-box:not([hidden])") ||
        document.querySelector(".card") || document.querySelector("main") || document.body;
    }

    function updateStatus(record) {
      const value = record?.status || "pending";
      status.className = `parlo-distance-review-status ${value}`;
      if (value === "approved") {
        status.textContent = `✅ ${reviewItemLabelCapitalized} approvata`;
      } else if (value === "rejected") {
        status.textContent = `❌ ${reviewItemLabelCapitalized} non approvata`;
      } else {
        status.textContent = `⏳ ${reviewItemLabelCapitalized} in attesa di revisione`;
      }
      activeAnswerCard?.classList.toggle("review-approved", value === "approved");
      activeAnswerCard?.classList.toggle("review-rejected", value === "rejected");
    }

    function bindActiveReview() {
      if (commentSaveTimer) {
        clearTimeout(commentSaveTimer);
        commentSaveTimer = null;
        if (isDirty) saveReview({});
      }
      const scope = resolveScope();
      const parent = getTargetContainer();
      activeAnswerCard = parent.matches?.(answerSelector)
        ? parent
        : parent.querySelector?.(answerSelector) || null;
      activeAnswerCard?.classList.add("parlo-distance-review-answer");
      if (activeAnswerCard && activeAnswerCard.nextElementSibling !== answerActions) {
        activeAnswerCard.insertAdjacentElement("afterend", answerActions);
      }
      answerActions.hidden = !activeAnswerCard || (isTeacher && !selectedStudentId);
      if (activeAnswerCard && commentPlacement === "section") {
        const section = activeAnswerCard.closest(".section-box") || parent;
        if (section.lastElementChild !== reviewBox) section.appendChild(reviewBox);
      } else if (activeAnswerCard) {
        if (answerActions.nextElementSibling !== reviewBox) answerActions.insertAdjacentElement("afterend", reviewBox);
      } else if (reviewBox.parentElement !== parent) {
        parent.appendChild(reviewBox);
      }
      const studentLabel = isTeacher
        ? selectedStudentId.replace(/_/g, " ")
        : String(session.name || "");
      title.textContent = `👩‍🏫 Revisione${studentLabel ? ` · ${studentLabel}` : ""}${scope.cardLabel ? ` · ${scope.cardLabel}` : ""}`;
      if (activeReviewRef && reviewListener) activeReviewRef.off("value", reviewListener);
      activeReviewRef = null;
      reviewListener = null;
      reviewRecord = {};
      comment.value = "";
      isDirty = false;
      updateStatus({ status: "pending" });

      const id = isTeacher ? selectedStudentId : storageStudentId;
      if (!id) {
        comment.value = "Seleziona uno studente dalla pagina iniziale per vedere la revisione.";
        comment.readOnly = true;
        actions.hidden = true;
        answerActions.hidden = true;
        meta.textContent = "";
        return;
      }

      comment.readOnly = !isTeacher;
      actions.hidden = !isTeacher;
      let safeId = String(id).replace(/[.#$\/\[\]]/g, "_");
      if (usesLegacyDistancePath && !safeId.startsWith("student_")) safeId = `student_${safeId}`;
      activeReviewRef = reviewBase.child(safeId).child(scope.card);
      reviewListener = snapshot => {
        reviewRecord = snapshot.val() || {};
        updateStatus(reviewRecord);
        if (!isDirty || !isTeacher) comment.value = String(reviewRecord.text || "");
        meta.textContent = reviewRecord.updatedAt
          ? `Aggiornata${reviewRecord.teacher ? ` da ${reviewRecord.teacher}` : ""} · ${new Date(reviewRecord.updatedAt).toLocaleString("it-IT")}`
          : "Nessun commento salvato per questa scheda.";
      };
      activeReviewRef.on("value", reviewListener, () => {
        status.textContent = "⚠️ Impossibile caricare la revisione.";
      });
    }

    async function saveReview(updates = {}) {
      if (!isTeacher || !activeReviewRef || saving) return;
      saving = true;
      [saveButton, approveButton, rejectButton, pendingButton].forEach(button => { button.disabled = true; });
      const next = {
        ...reviewRecord,
        ...updates,
        text: comment.value.trim(),
        teacher: String(session.teacherName || session.name || "Insegnante"),
        updatedAt: Date.now()
      };
      try {
        await activeReviewRef.set(next);
        reviewRecord = next;
        isDirty = false;
        updateStatus(next);
      } catch (_) {
        meta.textContent = "⚠️ Errore: impossibile salvare la revisione.";
      } finally {
        saving = false;
        [saveButton, approveButton, rejectButton, pendingButton].forEach(button => { button.disabled = false; });
      }
    }

    comment.addEventListener("input", () => {
      isDirty = true;
      clearTimeout(commentSaveTimer);
      commentSaveTimer = setTimeout(() => {
        commentSaveTimer = null;
        saveReview({});
      }, 450);
    });
    saveButton.addEventListener("click", () => saveReview({}));
    approveButton.addEventListener("click", () => saveReview({ status: "approved" }));
    rejectButton.addEventListener("click", () => saveReview({ status: "rejected" }));
    pendingButton.addEventListener("click", () => saveReview({ status: "pending" }));

    window.addEventListener("parlo:notes-scope-changed", event => {
      window.ParloNotesScope = event.detail || window.ParloNotesScope || {};
      bindActiveReview();
    });
    window.addEventListener("parlo:review-student-changed", event => {
      if (event.detail?.studentId != null) selectedStudentId = String(event.detail.studentId).replace(/^student_/, "");
      bindActiveReview();
    });
    const observer = new MutationObserver(() => {
      const target = getTargetContainer();
      if (target && (target.matches?.(answerSelector)
        ? target.nextElementSibling !== answerActions || (commentPlacement === "section"
          ? reviewBox.parentElement !== target.closest(".section-box") || target.closest(".section-box")?.lastElementChild !== reviewBox
          : answerActions.nextElementSibling !== reviewBox)
        : reviewBox.parentElement !== target)) bindActiveReview();
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
    bindActiveReview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
