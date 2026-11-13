(() => {
  const teacherPins = { Antonio: "2202", Assel: "2109" };
  function addStyles() {
    if (document.getElementById("homework-review-styles")) return;
    const style = document.createElement("style");
    style.id = "homework-review-styles";
    style.textContent = `
      #homework-review { max-width: 900px; margin: 24px auto; padding: clamp(20px,4vw,34px); border: 1px solid #d8e5d8; border-radius: 22px; background: #fffefa; box-shadow: 0 12px 34px rgba(43,69,46,.09); color: #292d28; }
      #homework-review h1,#homework-review h2,#homework-review h3 { color: #2f5739; }
      #homework-review .review-top { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; }
      #homework-review a,#homework-review button { min-height:40px; padding:8px 14px; border:0; border-radius:9px; background:#2f5739; color:#fff; font:inherit; font-weight:700; text-decoration:none; cursor:pointer; }
      #homework-review a { display:inline-flex; align-items:center; background:#edf4ed; color:#2f5739; }
      #homework-review button:disabled { opacity:.55; cursor:wait; }
      #homework-review .review-status { padding:12px 14px; border-radius:10px; background:#edf4ed; color:#2f5739; font-weight:700; line-height:1.5; }
      #homework-review .review-status.error { background:#fde8e7; color:#a51d1d; }
      #homework-review details.review-section { margin:14px 0; border:1px solid #d8e5d8; border-radius:12px; background:#fff; }
      #homework-review details.review-section > summary { padding:14px 16px; background:#edf4ed; color:#2f5739; font-weight:800; cursor:pointer; }
      #homework-review .review-row { margin:12px; padding:14px; border:1px solid #e7e5dc; border-radius:10px; background:#fffefa; }
      #homework-review .review-label { margin:0 0 8px; font-weight:800; }
      #homework-review .review-value { margin:6px 0; padding:9px 11px; border-radius:8px; background:#f5f5ef; white-space:pre-wrap; overflow-wrap:anywhere; }
      #homework-review .review-model { color:#6b7069; font-size:.9rem; }
      #homework-review .review-row textarea { display:block; width:100%; min-height:68px; margin:10px 0; padding:9px 11px; border:1px solid #d4e1d5; border-radius:8px; font:inherit; resize:vertical; }
      #homework-review .review-actions { display:flex; flex-wrap:wrap; gap:8px; }
      #homework-review .review-actions button.reject { background:#a51d1d; }
      #homework-review .review-actions button.selected { outline:3px solid rgba(189,105,77,.35); }
      #homework-review .review-row[data-grade="approved"] { border-color:#278253; background:#e1f1e5; }
      #homework-review .review-row[data-grade="rejected"] { border-color:#c62828; background:#fde8e7; }
      #homework-review .review-footer { margin-top:18px; }
      @media(max-width:600px) { #homework-review { margin:12px 8px; padding:17px; } }
    `;
    document.head.appendChild(style);
  }

  function formatValue(value) {
    if (value === null || value === undefined || value === "") return "Nessuna risposta registrata.";
    if (Array.isArray(value)) return value.map(item => item == null || item === "" ? "—" : String(item)).join(" · ");
    if (typeof value === "object") return Object.entries(value).map(([key, item]) => `${key}: ${formatValue(item)}`).join("\n");
    return String(value);
  }

  window.openHomeworkTeacherReview = async function ({ taskData, buildRows }) {
    const params = new URLSearchParams(location.search);
    const hasReviewTarget = params.has("group") && params.has("student");
    if (params.get("teacherReview") !== "1" && !hasReviewTarget) return false;

    let session = null;
    try { session = JSON.parse(localStorage.getItem("parlo_session") || "null"); } catch (_) {}
    const assignmentId = params.get("assignment");
    const groupId = params.get("group");
    const studentKey = params.get("student");
    if (!session?.isTeacher || !teacherPins[session.teacher] || !assignmentId || !groupId || !studentKey) {
      throw new Error("Accedi come insegnante dalla pagina principale per correggere questo compito.");
    }
    if (!window.firebase) throw new Error("Firebase non disponibile.");
    if (!firebase.apps.length) firebase.initializeApp({
      databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "esercizi-parlo-italiano"
    });

    const assignmentRef = firebase.database().ref(`compiti/gruppi/${groupId}/assegnazioni/${assignmentId}`);
    const assignmentSnapshot = await assignmentRef.once("value");
    const assignment = assignmentSnapshot.val();

    // Se l'utente è un insegnante autenticato, bypassiamo il blocco rigido del path
    const isTeacherAuthorized = session?.isTeacher && teacherPins[session.teacher];
    const expectedPath = assignment?.taskPath ? new URL(assignment.taskPath, location.origin).pathname : "";
    
    if (!assignment || (!isTeacherAuthorized && expectedPath !== location.pathname)) {
      throw new Error("Compito non disponibile per questo gruppo.");
    }

    const submissionRef = assignmentRef.child(`consegne/${studentKey}`);
    const submissionSnapshot = await submissionRef.once("value");
    const submission = submissionSnapshot.val();
    
    // Anche qui, permettiamo all'insegnante di aprire la consegna anche se lo status fosse diverso da pending/reviewed (opzionale)
    if (!submission || (!isTeacherAuthorized && !["pending", "reviewed"].includes(submission.status))) {
      throw new Error("La consegna non è in attesa di correzione o non è disponibile.");
    }

    addStyles();
    const main = document.querySelector("main") || document.body;
    [...main.children].forEach(child => { child.hidden = true; });
    const root = document.createElement("section");
    root.id = "homework-review";
    main.appendChild(root);

    const header = document.createElement("div");
    header.className = "review-top";
    const back = document.createElement("a");
    back.href = new URL("../../compiti.html", location.href).href;
    back.textContent = "← Torna alla gestione compiti";
    const title = document.createElement("h1");
    title.textContent = taskData.title || "Correzione del compito";
    title.style.margin = "0";
    header.append(back, title);
    root.appendChild(header);

    const status = document.createElement("p");
    status.className = "review-status";
    status.setAttribute("role", "status");
    status.textContent = `Correzione di ${submission.studentName || studentKey} · ${submission.status === "reviewed" ? "compito già revisionato" : "in attesa di correzione"}.`;
    root.appendChild(status);

    const sections = buildRows(submission) || [];
    const savedReview = submission.teacherReview?.answers || {};
    sections.forEach((section, sectionIndex) => {
      const details = document.createElement("details");
      details.className = "review-section";
      details.open = sectionIndex === 0;
      const summary = document.createElement("summary");
      summary.textContent = section.title || `Parte ${sectionIndex + 1}`;
      details.appendChild(summary);
      (section.rows || []).forEach((row, rowIndex) => {
        const reviewKey = String(row.id ?? rowIndex).replace(/[.#$\/\[\]]/g, "_");
        const rowRef = submissionRef.child(`teacherReview/answers/${section.id}/${reviewKey}`);
        const prior = savedReview[section.id]?.[reviewKey] || {};
        const card = document.createElement("article");
        card.className = "review-row";
        card.dataset.grade = prior.grade || "";
        const label = document.createElement("p");
        label.className = "review-label";
        label.textContent = row.prompt || `Risposta ${rowIndex + 1}`;
        const response = document.createElement("div");
        response.className = "review-value";
        response.textContent = formatValue(row.answer);
        card.append(label, response);
        if (row.expected !== undefined && row.expected !== null && row.expected !== "") {
          const model = document.createElement("p");
          model.className = "review-model";
          model.textContent = `Risposta attesa: ${formatValue(row.expected)}`;
          card.appendChild(model);
        }
        const comment = document.createElement("textarea");
        comment.maxLength = 1000;
        comment.placeholder = "Commento per lo studente (facoltativo)";
        comment.value = prior.comment || "";
        comment.setAttribute("aria-label", `Commento: ${label.textContent}`);
        const actions = document.createElement("div");
        actions.className = "review-actions";
        [["approved", "✓ Approva", ""], ["rejected", "✕ Da rivedere", "reject"]].forEach(([grade, text, className]) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = `${className}${prior.grade === grade ? " selected" : ""}`.trim();
          button.textContent = text;
          button.addEventListener("click", async () => {
            button.disabled = true;
            try {
              const review = { grade, comment: comment.value.trim(), reviewedBy: session.teacher, updatedAt: Date.now() };
              await rowRef.set(review);
              card.dataset.grade = grade;
              actions.querySelectorAll("button").forEach(item => item.classList.toggle("selected", item === button));
              status.className = "review-status";
              status.textContent = "Esito salvato. Puoi continuare la correzione o inviarla allo studente.";
            } catch (_) {
              status.className = "review-status error";
              status.textContent = "Impossibile salvare l’esito. Controlla la connessione e riprova.";
            } finally { button.disabled = false; }
          });
          actions.appendChild(button);
        });
        card.append(comment, actions);
        details.appendChild(card);
      });
      root.appendChild(details);
    });

    const footer = document.createElement("div");
    footer.className = "review-footer";
    const finish = document.createElement("button");
    finish.type = "button";
    finish.textContent = submission.status === "reviewed" ? "Salva la revisione" : "Invia la correzione allo studente";
    finish.addEventListener("click", async () => {
      finish.disabled = true;
      try {
        await submissionRef.update({ status: "reviewed", reviewedAt: Date.now(), reviewedBy: session.teacher });
        status.className = "review-status";
        status.textContent = `Correzione inviata a ${submission.studentName || studentKey}.`;
        finish.textContent = "Revisione salvata";
      } catch (_) {
        status.className = "review-status error";
        status.textContent = "Impossibile inviare la correzione. Controlla la connessione e riprova.";
        finish.disabled = false;
      }
    });
    footer.appendChild(finish);
    root.appendChild(footer);
    document.title = `Correzione · ${taskData.title || "Compito"}`;
    return true;
  };
})();
