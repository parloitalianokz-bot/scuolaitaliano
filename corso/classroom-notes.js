/* Popup condiviso Appunti di classe: istanza unica, mobile e isolata per gruppo, esercizio e scheda. */
(() => {
  "use strict";

  // Impedisce la doppia inizializzazione anche in caso di inclusione multipla dello script
  if (window.__parloClassroomNotesLoaded) return;
  window.__parloClassroomNotesLoaded = true;

  const session = window.ParloSession || {};
  const isTeacher = Boolean(session.isTeacher);
  const safeGroup = session.safeGroup || "sconosciuto";
  const defaultExercise = String(
    location.pathname.split("/").pop().replace(/\.html$/i, "").replace(/[.#$\/\[\]]/g, "_") ||
    "esercizio"
  );

  function getDb() {
    if (window.ParloModes && typeof window.ParloModes.initFirebase === "function") {
      return window.ParloModes.initFirebase();
    }
    if (window.firebase && firebase.apps && firebase.apps.length) {
      return firebase.database();
    }
    return null;
  }

  const db = getDb();
  if (!db) return;

  const style = document.createElement("style");
  style.textContent = `
    .parlo-notes-fab {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 950;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 46px;
      padding: 10px 16px;
      border: 1.5px solid #2f5739;
      border-radius: 999px;
      background: #477755;
      color: #fff;
      font: 700 0.92rem/1 'Segoe UI', Inter, system-ui, sans-serif;
      cursor: grab;
      touch-action: none;
      user-select: none;
      box-shadow: 0 10px 26px rgba(43, 69, 46, 0.28);
      transition: background 0.18s, box-shadow 0.18s;
    }
    .parlo-notes-fab:hover {
      background: #2f5739;
    }
    .parlo-notes-fab.is-dragging {
      cursor: grabbing;
      box-shadow: 0 14px 32px rgba(31, 49, 34, 0.38);
    }
    .parlo-notes-grip {
      opacity: 0.72;
      font-size: 0.85rem;
      letter-spacing: -1px;
    }
    .parlo-notes-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #86efac;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
      display: none;
    }
    .parlo-notes-fab.has-notes .parlo-notes-dot {
      display: inline-block;
    }
    .parlo-notes-fab.has-unread .parlo-notes-dot {
      background: #fde047;
      animation: parloNotesPulse 1.2s ease-in-out infinite;
    }
    @keyframes parloNotesPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.35); }
    }

    .parlo-notes-popup {
      position: fixed;
      right: 18px;
      bottom: 74px;
      z-index: 960;
      width: min(420px, calc(100vw - 24px));
      padding: 14px 16px 16px;
      border: 1.5px solid #c7d8c8;
      border-radius: 20px;
      background: #fffefa;
      color: #292d28;
      box-shadow: 0 20px 50px rgba(31, 49, 34, 0.25);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .parlo-notes-popup[hidden] {
      display: none !important;
    }
    .parlo-notes-popup.is-dragging {
      box-shadow: 0 26px 60px rgba(31, 49, 34, 0.34);
    }
    .parlo-notes-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 2px 0 9px;
      border-bottom: 1px solid #e7e5dc;
      cursor: grab;
      touch-action: none;
      user-select: none;
    }
    .parlo-notes-popup.is-dragging .parlo-notes-header {
      cursor: grabbing;
    }
    .parlo-notes-title-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .parlo-notes-title {
      margin: 0;
      color: #2f5739;
      font-size: 1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .parlo-notes-scope {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 3px 9px;
      border-radius: 999px;
      background: #edf4ed;
      color: #2f5739;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .parlo-notes-close {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      border: 1px solid #d8e5d8;
      border-radius: 10px;
      background: #fff;
      color: #2f5739;
      font: 800 1rem/1 inherit;
      cursor: pointer;
    }
    .parlo-notes-close:hover {
      background: #edf4ed;
    }
    .parlo-notes-textarea {
      width: 100%;
      min-height: 150px;
      max-height: 52vh;
      padding: 11px 12px;
      border: 1.5px solid #d4e1d5;
      border-radius: 12px;
      background: #fff;
      color: #292d28;
      font: inherit;
      font-size: 0.94rem;
      line-height: 1.5;
      resize: vertical;
    }
    .parlo-notes-textarea[readonly] {
      background: #f8faf8;
    }
    .parlo-notes-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      min-height: 1.2em;
      font-size: 0.8rem;
      font-weight: 700;
      color: #6b7069;
    }
  `;
  document.head.appendChild(style);

  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "parlo-notes-fab";
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-controls", "parlo-notes-popup");
  fab.setAttribute("title", "Trascina per spostare o clicca per aprire gli appunti");
  fab.innerHTML =
    `<span class="parlo-notes-grip" aria-hidden="true">⋮⋮</span>` +
    `<span>📝 Appunti</span>` +
    `<span class="parlo-notes-dot" aria-hidden="true"></span>`;

  const popup = document.createElement("aside");
  popup.id = "parlo-notes-popup";
  popup.className = "parlo-notes-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-label", "Appunti di classe");
  popup.hidden = true;

  const header = document.createElement("div");
  header.className = "parlo-notes-header";
  header.setAttribute("title", "Trascina per spostare la finestra");

  const titleWrap = document.createElement("div");
  titleWrap.className = "parlo-notes-title-wrap";

  const title = document.createElement("h2");
  title.className = "parlo-notes-title";
  title.innerHTML = `<span class="parlo-notes-grip" aria-hidden="true">⋮⋮</span><span>📝 Appunti di classe</span>`;

  const scopeBadge = document.createElement("span");
  scopeBadge.className = "parlo-notes-scope";

  titleWrap.append(title, scopeBadge);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "parlo-notes-close";
  closeBtn.textContent = "✕";
  closeBtn.setAttribute("aria-label", "Chiudi gli appunti di classe");

  header.append(titleWrap, closeBtn);

  const textarea = document.createElement("textarea");
  textarea.className = "parlo-notes-textarea";
  textarea.readOnly = !isTeacher;
  textarea.placeholder = isTeacher
    ? "Scrivi qui gli appunti per questa scheda (visibili in tempo reale a tutta la classe)..."
    : "Nessun appunto dell’insegnante per questa scheda.";
  textarea.setAttribute("aria-label", "Testo degli appunti di classe");

  const footer = document.createElement("div");
  footer.className = "parlo-notes-footer";

  const statusText = document.createElement("span");
  statusText.setAttribute("role", "status");
  statusText.setAttribute("aria-live", "polite");
  footer.appendChild(statusText);

  popup.append(header, textarea, footer);
  document.body.append(fab, popup);

  const POS_STORAGE_KEY = "parlo_notes_positions_v1";
  const VIEWPORT_MARGIN = 8;

  function loadPositions() {
    try {
      return JSON.parse(sessionStorage.getItem(POS_STORAGE_KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function savePosition(key, left, top) {
    try {
      const current = loadPositions();
      current[key] = { left, top };
      sessionStorage.setItem(POS_STORAGE_KEY, JSON.stringify(current));
    } catch (_) {}
  }

  function applyClampedPosition(el, left, top) {
    const rect = el.getBoundingClientRect();
    const maxLeft = Math.max(VIEWPORT_MARGIN, window.innerWidth - rect.width - VIEWPORT_MARGIN);
    const maxTop = Math.max(VIEWPORT_MARGIN, window.innerHeight - rect.height - VIEWPORT_MARGIN);
    const clampedLeft = Math.min(Math.max(VIEWPORT_MARGIN, left), maxLeft);
    const clampedTop = Math.min(Math.max(VIEWPORT_MARGIN, top), maxTop);

    el.style.left = `${clampedLeft}px`;
    el.style.top = `${clampedTop}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";
    return { left: clampedLeft, top: clampedTop };
  }

  function restoreElementPosition(el, storageKey) {
    const saved = loadPositions()[storageKey];
    if (saved && typeof saved.left === "number" && typeof saved.top === "number") {
      applyClampedPosition(el, saved.left, saved.top);
    }
  }

  function makeDraggable({ handle, target, storageKey, ignoreSelector, onClick }) {
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let origLeft = 0;
    let origTop = 0;
    let hasMoved = false;

    handle.addEventListener("pointerdown", event => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      if (ignoreSelector && event.target.closest(ignoreSelector)) return;

      const rect = target.getBoundingClientRect();
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      origLeft = rect.left;
      origTop = rect.top;
      hasMoved = false;

      handle.setPointerCapture(pointerId);
    });

    handle.addEventListener("pointermove", event => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      if (!hasMoved && Math.hypot(dx, dy) < 5) return;
      hasMoved = true;
      target.classList.add("is-dragging");
      applyClampedPosition(target, origLeft + dx, origTop + dy);
    });

    function endDrag(event) {
      if (event.pointerId !== pointerId) return;
      if (handle.hasPointerCapture(pointerId)) {
        handle.releasePointerCapture(pointerId);
      }
      pointerId = null;
      target.classList.remove("is-dragging");

      if (hasMoved) {
        const rect = target.getBoundingClientRect();
        savePosition(storageKey, rect.left, rect.top);
      } else if (typeof onClick === "function") {
        onClick(event);
      }
    }

    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
  }

  let isOpen = false;
  let currentRef = null;
  let currentListener = null;
  let saveTimer = null;
  let isDirty = false;
  let lastKnownText = "";

  function setPopupOpen(open) {
    isOpen = Boolean(open);
    popup.hidden = !isOpen;
    fab.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      fab.classList.remove("has-unread");
      const saved = loadPositions().popup;
      if (saved && typeof saved.left === "number" && typeof saved.top === "number") {
        applyClampedPosition(popup, saved.left, saved.top);
      } else {
        const fabRect = fab.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const initialLeft = fabRect.right - popupRect.width;
        const initialTop = fabRect.top - popupRect.height - 10;
        applyClampedPosition(popup, initialLeft, initialTop);
      }
      if (isTeacher) textarea.focus();
    } else if (isDirty) {
      flushSave();
    }
  }

  makeDraggable({
    handle: fab,
    target: fab,
    storageKey: "fab",
    onClick: () => setPopupOpen(!isOpen)
  });

  fab.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setPopupOpen(!isOpen);
    }
  });

  makeDraggable({
    handle: header,
    target: popup,
    storageKey: "popup",
    ignoreSelector: "button"
  });

  restoreElementPosition(fab, "fab");

  window.addEventListener("resize", () => {
    if (fab.style.left) {
      const r = fab.getBoundingClientRect();
      applyClampedPosition(fab, r.left, r.top);
    }
    if (!popup.hidden && popup.style.left) {
      const r = popup.getBoundingClientRect();
      applyClampedPosition(popup, r.left, r.top);
    }
  });

  closeBtn.addEventListener("click", () => setPopupOpen(false));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen) {
      setPopupOpen(false);
      fab.focus();
    }
  });

  function resolveScope() {
    const scope = window.ParloNotesScope || {};
    const group = String(scope.group || safeGroup).replace(/[.#$\/\[\]]/g, "_");
    const exercise = String(scope.exercise || defaultExercise).replace(/[.#$\/\[\]]/g, "_");
    const card = String(scope.card || "scheda_unica").replace(/[.#$\/\[\]]/g, "_");
    const cardLabel = String(scope.cardLabel || "").trim();
    return { group, exercise, card, cardLabel };
  }

  function flushSave() {
    if (!isTeacher || !currentRef || !isDirty) return;
    clearTimeout(saveTimer);
    saveTimer = null;
    const text = textarea.value;
    statusText.textContent = "⏳ Salvataggio...";
    currentRef.set(text)
      .then(() => {
        isDirty = false;
        lastKnownText = text;
        fab.classList.toggle("has-notes", text.trim().length > 0);
        statusText.textContent = "✓ Salvato";
      })
      .catch(() => {
        statusText.textContent = "⚠️ Errore di salvataggio";
      });
  }

  function bindScope() {
    if (isDirty) flushSave();

    if (currentRef && currentListener) {
      currentRef.off("value", currentListener);
    }

    const { group, exercise, card, cardLabel } = resolveScope();
    scopeBadge.textContent = cardLabel ? `📌 ${cardLabel}` : `📌 ${exercise}`;
    isDirty = false;
    lastKnownText = "";
    statusText.textContent = "";
    fab.classList.remove("has-notes", "has-unread");

    currentRef = db.ref(`appunti/${group}/${exercise}/${card}`);
    currentListener = snapshot => {
      const remoteValue = typeof snapshot.val() === "string" ? snapshot.val() : "";
      const hasContent = remoteValue.trim().length > 0;
      fab.classList.toggle("has-notes", hasContent);

      if (!isOpen && hasContent && remoteValue !== lastKnownText && lastKnownText !== "") {
        fab.classList.add("has-unread");
      }
      lastKnownText = remoteValue;

      if (!isDirty && document.activeElement !== textarea) {
        textarea.value = remoteValue;
      }
    };
    currentRef.on("value", currentListener);
  }

  if (isTeacher) {
    textarea.addEventListener("input", () => {
      isDirty = true;
      statusText.textContent = "⏳ Salvataggio...";
      clearTimeout(saveTimer);
      saveTimer = setTimeout(flushSave, 350);
    });
    textarea.addEventListener("blur", flushSave);
  }

  window.addEventListener("parlo:notes-scope-changed", bindScope);
  bindScope();
})();