(() => {
  const params = new URLSearchParams(window.location.search);
  let storedSession = {};
  try {
    storedSession = JSON.parse(localStorage.getItem("parlo_session") || "{}");
  } catch (_) {}

  const group = storedSession.group || params.get("gruppo") || "sconosciuto";
  const isTeacher = Boolean(storedSession.isTeacher);
  const name = isTeacher
    ? (storedSession.teacher || storedSession.name || "Insegnante")
    : (storedSession.name || params.get("nome") || localStorage.getItem("parlo_student_name") || "");
  const safeGroup = group.replace(/[.#$\/\[\]]/g, "_");
  window.parloUnit2Session = { group, name, safeGroup, isTeacher };

  if (group !== "sconosciuto") params.set("gruppo", group);
  else params.delete("gruppo");
  if (isTeacher) params.delete("nome");
  else if (name) params.set("nome", name);
  else params.delete("nome");
  if (params.toString() !== new URLSearchParams(window.location.search).toString()) {
    const query = params.toString();
    history.replaceState(history.state, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
  }

  if (name && !isTeacher) {
    try { localStorage.setItem("parlo_student_name", name); } catch (_) {}
  }

  if (window.firebase) {
    const originalDatabase = firebase.database.bind(firebase);
    firebase.database = function (...args) {
      const database = originalDatabase(...args);
      if (!database.__parloUnit2Scoped) {
        const originalRef = database.ref.bind(database);
        database.ref = path => {
          if (typeof path === "string" && /^esercizi\/unita2-/.test(path)) {
            path = `esercizi/gruppi/${safeGroup}/${path.slice("esercizi/".length)}`;
          }
          return originalRef(path);
        };
        database.__parloUnit2Scoped = true;
      }
      return database;
    };
  }

  const navigation = document.querySelector(".top-menu, .top-exercises");
  if (navigation) {
    const homeLink = document.createElement("a");
    homeLink.href = "../index.html";
    homeLink.className = "home-link";
    homeLink.setAttribute("aria-label", "Torna alla pagina iniziale");
    homeLink.title = "Home";
    homeLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" width="19" height="19"><path fill="currentColor" d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z"/></svg>';
    navigation.prepend(homeLink);

    let badge = document.getElementById("user-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.id = "user-badge";
    }
    badge.textContent = group === "sconosciuto"
      ? "Accedi dalla pagina iniziale per associare l’attività al gruppo."
      : `${isTeacher ? "👩‍🏫" : "👤"} ${group}${name ? ` · ${name}` : ""}`;
    badge.setAttribute("aria-live", "polite");
    Object.assign(badge.style, { color: "#bd694d", fontSize: ".85rem", fontWeight: "700" });
    navigation.insertBefore(badge, navigation.children[1] || null);
  }

  if (!document.querySelector('script[src*="classroom-notes.js"]')) {
    const notesScript = document.createElement("script");
    notesScript.src = "../classroom-notes.js";
    document.body.appendChild(notesScript);
  }
})();
