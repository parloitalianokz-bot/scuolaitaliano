(() => {
  if (window.__parloClassroomNotesLoaded) return;
  window.__parloClassroomNotesLoaded = true;

  const params = new URLSearchParams(location.search);
  let session = {};
  try { session = JSON.parse(localStorage.getItem("parlo_session") || "{}"); } catch (_) {}
  const group = (params.get("gruppo") || session.group || "").trim();
  const name = (params.get("nome") || (!session.isTeacher ? session.name : "") || "").trim();
  const teacherName = (params.get("insegnante") || (session.isTeacher ? session.name : "") || "insegnante").trim();
  const isTeacher = Boolean(session.isTeacher) || Boolean(group && group !== "sconosciuto" && !name);
  const unitMatch = location.pathname.match(/u_(\d+)/i);
  const unit = unitMatch ? unitMatch[1].replace(/^0+/, "") || "0" : "generale";
  const safe = value => value.replace(/[.#$\/\[\]]/g, "_");
  const safeGroup = safe(group || "sconosciuto");
  const myId = safe(name || "insegnante");
  const databasePath = `esercizi/gruppi/${safeGroup}/note-condivise/unita-${safe(unit)}`;

  const styles = document.createElement("style");
  styles.textContent = `
    #parlo-notes-launcher{position:fixed;z-index:9998;right:20px;bottom:20px;padding:12px 17px;border:0;border-radius:999px;background:#2f5739;color:#fff;font:700 15px/1.2 system-ui,sans-serif;box-shadow:0 5px 20px #0003;cursor:pointer}
    #parlo-notes-launcher:hover{background:#24452d}
    #parlo-notes-dialog{position:fixed;z-index:9999;inset:0;display:grid;place-items:center;padding:16px;background:#18201999;font-family:system-ui,sans-serif}
    #parlo-notes-dialog[hidden]{display:none}
    #parlo-notes-panel{display:flex;flex-direction:column;gap:12px;width:min(760px,100%);max-height:min(86vh,900px);padding:20px;border:1px solid #d8e5d8;border-radius:18px;background:#fffefa;color:#292d28;box-shadow:0 18px 55px #0004}
    #parlo-notes-panel h2{margin:0;color:#2f5739;font-size:1.25rem}
    #parlo-notes-header{display:flex;align-items:center;justify-content:space-between;gap:12px}
    #parlo-notes-close{border:0;background:transparent;color:#39463a;font-size:1.7rem;cursor:pointer}
    #parlo-notes-tools{display:flex;flex-wrap:wrap;align-items:center;gap:7px}
    #parlo-notes-tools button,#parlo-notes-tools select{min-height:36px;padding:6px 10px;border:1px solid #d8e5d8;border-radius:8px;background:#fff;color:#2f5739;font:600 14px system-ui,sans-serif;cursor:pointer}
    #parlo-notes-tools button[aria-pressed="true"]{background:#edf4ed}
    #parlo-notes-writer{display:flex;align-items:center;flex-wrap:wrap;gap:8px;color:#2f5739;font-size:.92rem;font-weight:700}
    #parlo-notes-writer select{max-width:100%;padding:7px 10px;border:1px solid #d8e5d8;border-radius:8px;font:inherit}
    #parlo-notes-content{min-height:220px;overflow:auto;padding:14px;border:1px solid #d8ccb5;border-radius:12px;background:#fff;color:#292d28;font:16px/1.6 system-ui,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere}
    #parlo-notes-content[contenteditable="false"]{background:#f5f4ef}
    #parlo-notes-status{min-height:1.35em;margin:0;color:#59645a;font-size:.87rem}
    #parlo-notes-panel .visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    @media(max-width:600px){#parlo-notes-launcher{right:12px;bottom:12px}#parlo-notes-panel{padding:14px}#parlo-notes-content{min-height:190px}}
  `;
  document.head.appendChild(styles);

  const launcher = document.createElement("button");
  launcher.id = "parlo-notes-launcher";
  launcher.type = "button";
  launcher.textContent = "📝 Appunti di classe";
  launcher.setAttribute("aria-haspopup", "dialog");
  launcher.setAttribute("aria-controls", "parlo-notes-dialog");

  const dialog = document.createElement("div");
  dialog.id = "parlo-notes-dialog";
  dialog.hidden = true;
  dialog.innerHTML = `
    <section id="parlo-notes-panel" role="dialog" aria-modal="true" aria-labelledby="parlo-notes-title">
      <header id="parlo-notes-header"><h2 id="parlo-notes-title">📝 Appunti di classe</h2><button id="parlo-notes-close" type="button" aria-label="Chiudi">×</button></header>
      <div id="parlo-notes-writer" hidden><label for="parlo-notes-student">Studente autorizzato a scrivere:</label><select id="parlo-notes-student"><option value="">Nessuno · solo insegnante</option></select></div>
      <div id="parlo-notes-tools" hidden aria-label="Formattazione del testo">
        <button type="button" data-command="bold" aria-label="Grassetto"><strong>G</strong></button>
        <button type="button" data-command="italic" aria-label="Corsivo"><em>C</em></button>
        <label for="parlo-notes-size" class="visually-hidden">Dimensione del testo</label>
        <select id="parlo-notes-size" aria-label="Dimensione del testo"><option value="3">Normale</option><option value="4">Grande</option><option value="5">Molto grande</option><option value="2">Piccolo</option></select>
        <label for="parlo-notes-color" class="visually-hidden">Colore del testo</label>
        <input id="parlo-notes-color" type="color" value="#2f5739" aria-label="Colore del testo" style="width:42px;height:36px;padding:3px;border:1px solid #d8e5d8;border-radius:8px">
      </div>
      <div id="parlo-notes-content" contenteditable="false" role="textbox" aria-label="Note e osservazioni condivise" aria-multiline="true"></div>
      <p id="parlo-notes-status" role="status" aria-live="polite">Connessione in corso…</p>
    </section>`;
  document.body.append(launcher, dialog);

  const editor = dialog.querySelector("#parlo-notes-content");
  const status = dialog.querySelector("#parlo-notes-status");
  const closeButton = dialog.querySelector("#parlo-notes-close");
  const writerRow = dialog.querySelector("#parlo-notes-writer");
  const writerSelect = dialog.querySelector("#parlo-notes-student");
  const tools = dialog.querySelector("#parlo-notes-tools");
  let notesRef = null;
  let selectedWriter = "";
  launcher.hidden = !isTeacher;
  closeButton.hidden = !isTeacher;
  let participants = {};
  let sharedTeacherName = teacherName;
  let saveTimer = null;
  let currentHtml = "";

  function amCurrentWriter() {
    return isTeacher ? !selectedWriter : Boolean(name && selectedWriter === myId);
  }

  function sanitizeHtml(html) {
    const parsed = new DOMParser().parseFromString(`<div>${html || ""}</div>`, "text/html");
    const allowed = new Set(["B", "STRONG", "I", "EM", "U", "BR", "DIV", "P", "SPAN", "FONT"]);
    const cleanNode = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === "FONT") {
            const span = document.createElement("span");
            const color = child.getAttribute("color") || "";
            const size = child.getAttribute("size") || "";
            if (/^(#[0-9a-f]{3,8}|[a-z]{3,20})$/i.test(color)) span.style.color = color;
            const fontSizes = { "1": "10px", "2": "12px", "3": "16px", "4": "20px", "5": "26px", "6": "32px", "7": "40px" };
            if (fontSizes[size]) span.style.fontSize = fontSizes[size];
            while (child.firstChild) span.appendChild(child.firstChild);
            child.replaceWith(span);
            child = span;
          }
          if (!allowed.has(child.tagName)) {
            child.replaceWith(document.createTextNode(child.textContent || ""));
            return;
          }
          [...child.attributes].forEach(attribute => {
            if (child.tagName !== "SPAN" || attribute.name !== "style") child.removeAttribute(attribute.name);
          });
          if (child.tagName === "SPAN" && child.hasAttribute("style")) {
            const color = child.style.color;
            const size = child.style.fontSize;
            child.removeAttribute("style");
            if (/^(#[0-9a-f]{3,8}|rgb\([\d, ]+\)|[a-z]{3,20})$/i.test(color)) child.style.color = color;
            if (/^(\d+(\.\d+)?(px|pt|em|rem|%))$/i.test(size)) child.style.fontSize = size;
            if (!child.getAttribute("style")) child.removeAttribute("style");
          }
          cleanNode(child);
        } else if (child.nodeType !== Node.TEXT_NODE) child.remove();
      });
    };
    const root = parsed.body.firstElementChild;
    cleanNode(root);
    return root.innerHTML;
  }

  function setEditorAccess() {
    const mayWrite = amCurrentWriter();
    editor.contentEditable = String(mayWrite);
    editor.setAttribute("aria-readonly", String(!mayWrite));
    writerRow.hidden = !isTeacher;
    tools.hidden = !isTeacher || !mayWrite;

    if (isTeacher) {
      status.textContent = selectedWriter
        ? `Scrive ${participants[selectedWriter] || writerSelect.selectedOptions[0]?.textContent || selectedWriter}.`
        : "Scrivi tu: nessuno studente è stato selezionato.";
    } else if (selectedWriter === myId) {
      status.textContent = "Scrivi tu.";
    } else if (selectedWriter) {
      status.textContent = `Scrive ${participants[selectedWriter] || selectedWriter}.`;
    } else {
      status.textContent = `Scrive insegnante ${sharedTeacherName}.`;
    }
  }

  function saveHtml() {
    if (!notesRef || !amCurrentWriter()) return;
    const clean = sanitizeHtml(editor.innerHTML);
    currentHtml = clean;
    notesRef.child("html").set(clean).catch(() => { status.textContent = "Errore nel salvataggio degli appunti."; });
  }

  function loadFirebase(attempt = 0) {
    if (!window.firebase || !firebase.database) {
      if (attempt < 50) return setTimeout(() => loadFirebase(attempt + 1), 100);
      status.textContent = "Servizio note non disponibile: Firebase non è stato caricato.";
      return;
    }
    try {
      if (!firebase.apps.length) {
        const config = window.PARLO_FIREBASE_CONFIG || {
          apiKey: "INSERISCI_API_KEY",
          authDomain: "esercizi-parlo-italiano.firebaseapp.com",
          databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "esercizi-parlo-italiano",
          appId: "INSERISCI_APP_ID"
        };
        firebase.initializeApp(config);
      }
      if (!group || group === "sconosciuto") {
        status.textContent = "Accedi tramite il gruppo della classe per usare gli appunti condivisi.";
        return;
      }
      notesRef = firebase.database().ref(databasePath);
      if (isTeacher) {
        notesRef.child("insegnante").set(teacherName);
      } else if (name) {
        notesRef.child("partecipanti").child(myId).set(name);
      }
      notesRef.child("popup-aperto").on("value", snapshot => {
        dialog.hidden = snapshot.val() !== true;
        if (!dialog.hidden) setEditorAccess();
      }, () => { status.textContent = "Impossibile sincronizzare l'apertura degli appunti."; });
      notesRef.child("insegnante").on("value", snapshot => {
        sharedTeacherName = snapshot.val() || teacherName;
        setEditorAccess();
      });
      notesRef.child("html").on("value", snapshot => {
        const next = sanitizeHtml(snapshot.val() || "");
        currentHtml = next;
        if (document.activeElement !== editor) editor.innerHTML = next;
      }, () => { status.textContent = "Impossibile leggere gli appunti condivisi."; });
      notesRef.child("scrittore").on("value", snapshot => {
        selectedWriter = snapshot.val() || "";
        if (isTeacher) writerSelect.value = selectedWriter;
        setEditorAccess();
      });
      notesRef.child("partecipanti").on("value", snapshot => {
        participants = snapshot.val() || {};
        const selected = writerSelect.value;
        writerSelect.replaceChildren(new Option("Nessuno · solo insegnante", ""));
        Object.entries(participants).sort((a, b) => String(a[1]).localeCompare(String(b[1]), "it")).forEach(([id, studentName]) => {
          writerSelect.add(new Option(studentName, id));
        });
        writerSelect.value = selectedWriter || selected;
        setEditorAccess();
      });
      setEditorAccess();
    } catch (error) {
      console.error("Errore note condivise:", error);
      status.textContent = "Connessione agli appunti non riuscita. Verifica la configurazione Firebase.";
    }
  }

  launcher.addEventListener("click", () => {
    if (isTeacher && notesRef) notesRef.child("popup-aperto").set(true).catch(() => {
      status.textContent = "Impossibile aprire gli appunti condivisi.";
    });
  });
  closeButton.addEventListener("click", () => {
    if (isTeacher && notesRef) notesRef.child("popup-aperto").set(false).then(() => launcher.focus()).catch(() => {
      status.textContent = "Impossibile chiudere gli appunti condivisi.";
    });
  });
  dialog.addEventListener("click", event => {
    if (isTeacher && event.target === dialog && notesRef) notesRef.child("popup-aperto").set(false);
  });
  document.addEventListener("keydown", event => {
    if (isTeacher && event.key === "Escape" && !dialog.hidden && notesRef) {
      notesRef.child("popup-aperto").set(false).then(() => launcher.focus());
    }
  });
  writerSelect.addEventListener("change", () => {
    if (isTeacher && notesRef) notesRef.child("scrittore").set(writerSelect.value || null);
  });
  editor.addEventListener("input", () => {
    if (!amCurrentWriter()) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveHtml, 300);
  });
  editor.addEventListener("blur", () => { clearTimeout(saveTimer); saveHtml(); });

  tools.querySelectorAll("button[data-command]").forEach(button => button.addEventListener("click", () => {
    editor.focus();
    document.execCommand(button.dataset.command, false);
    saveHtml();
  }));
  dialog.querySelector("#parlo-notes-size").addEventListener("change", event => {
    editor.focus(); document.execCommand("fontSize", false, event.target.value); saveHtml();
  });
  dialog.querySelector("#parlo-notes-color").addEventListener("input", event => {
    editor.focus(); document.execCommand("foreColor", false, event.target.value); saveHtml();
  });

  setEditorAccess();
  loadFirebase();
})();
