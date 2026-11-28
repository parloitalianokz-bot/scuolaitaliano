/* Invio individuale e condivisione dei soli contributi confermati nelle letture. */
(() => {
  "use strict";

  const FIREBASE_CONFIG = {
    authDomain: "esercizi-parlo-italiano.firebaseapp.com",
    databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esercizi-parlo-italiano"
  };
  const SAFE_KEY = value => String(value || "").trim().replace(/[.#$\/[\]]/g, "_");

  function init() {
    const session = window.ParloSession || {};
    const safeGroup = session.safeGroup || "sconosciuto";
    const authorName = String(session.isTeacher
      ? (session.teacherName || session.name || "Insegnante")
      : (session.name || "")).trim();
    const identityKey = SAFE_KEY(session.studentId || authorName);
    const exerciseKey = String(document.body?.dataset?.pageKey || "lettura").replace(/[.#$\/[\]]/g, "_");
    const cards = Array.from(document.querySelectorAll(".reflection"));
    if (!cards.length) return;

    let database = null;
    if (window.firebase && safeGroup !== "sconosciuto") {
      if (window.ParloModes?.initFirebase) {
        database = window.ParloModes.initFirebase();
      } else {
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        database = firebase.database();
      }
    }

    cards.forEach((card, index) => {
      const textarea = card.querySelector("textarea");
      if (!textarea) return;

      const actions = document.createElement("div");
      actions.className = "reflection-actions";
      const submit = document.createElement("button");
      submit.type = "button";
      submit.className = "reflection-submit";
      submit.textContent = "Invia risposta";
      const status = document.createElement("span");
      status.className = "reflection-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      actions.append(submit, status);

      const contributions = document.createElement("section");
      contributions.className = "reflection-contributions";
      contributions.setAttribute("aria-label", `Contributi degli studenti per la scheda ${index + 1}`);
      const heading = document.createElement("h3");
      heading.textContent = "Contributi degli studenti";
      const empty = document.createElement("p");
      empty.className = "reflection-empty";
      empty.textContent = "Nessuna risposta inviata.";
      const list = document.createElement("ul");
      list.className = "reflection-contribution-list";
      contributions.append(heading, empty, list);
      textarea.insertAdjacentElement("afterend", actions);
      actions.insertAdjacentElement("afterend", contributions);

      if (!database || !authorName || !identityKey) {
        submit.disabled = true;
        status.textContent = !authorName
          ? "Accedi con il tuo nome per inviare una risposta."
          : "Contributi di gruppo non disponibili in questa modalità.";
        return;
      }

      const responseRef = database.ref(
        `esercizi/gruppi/${safeGroup}/${exerciseKey}/contributions/scheda_${index + 1}`
      );
      let savedOwnResponse = false;
      responseRef.on("value", snapshot => {
        const responses = snapshot.val() || {};
        const entries = Object.entries(responses)
          .map(([id, value]) => ({ id, ...(value || {}) }))
          .sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));
        list.replaceChildren();
        empty.hidden = entries.length > 0;
        entries.forEach(item => {
          const row = document.createElement("li");
          row.className = "reflection-contribution";
          const name = document.createElement("strong");
          name.textContent = item.authorName || "Partecipante";
          const text = document.createElement("p");
          text.textContent = item.text || "";
          row.append(name, text);
          list.appendChild(row);
        });
        const own = responses[identityKey];
        if (own) {
          savedOwnResponse = true;
          submit.textContent = "Aggiorna risposta";
          if (document.activeElement !== textarea && !textarea.value.trim()) {
            textarea.value = own.text || "";
          }
        }
      }, error => {
        status.textContent = `Errore nel caricamento dei contributi: ${error?.message || "riprova"}`;
      });

      submit.addEventListener("click", async () => {
        const text = textarea.value.trim();
        if (!text) {
          status.textContent = "Scrivi una risposta prima di inviarla.";
          textarea.focus();
          return;
        }
        submit.disabled = true;
        status.textContent = "Invio in corso…";
        try {
          await responseRef.child(identityKey).set({
            authorName,
            text,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });
          savedOwnResponse = true;
          submit.textContent = "Aggiorna risposta";
          status.textContent = "Risposta inviata e visibile al gruppo.";
        } catch (error) {
          status.textContent = `Errore durante l’invio: ${error?.message || "riprova"}`;
        } finally {
          submit.disabled = false;
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
