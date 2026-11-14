(() => {
  const params = new URLSearchParams(window.location.search);
  let storedSession = {};
  try {
    storedSession = JSON.parse(localStorage.getItem("parlo_session") || "{}");
  } catch (_) {}

  const group = String(storedSession.group || params.get("gruppo") || "").trim();
  const isTeacher = Boolean(storedSession.isTeacher)
    || Boolean(group && !params.get("nome") && !storedSession.name && params.has("gruppo"));
  const teacherName = String(storedSession.teacher || (isTeacher ? storedSession.name : "") || "Insegnante").trim();
  const name = isTeacher
    ? ""
    : String(params.get("nome") || storedSession.name || localStorage.getItem("parlo_student_name") || "").trim();
  const safeGroup = group.replace(/[.#$\/\[\]]/g, "_");
  window.parloUnit3Session = { group, name, teacherName, safeGroup, isTeacher };

  if (group) params.set("gruppo", group);
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

  const exerciseMenu = document.getElementById("exercise-menu");
  if (exerciseMenu) {
    const currentFile = window.location.pathname.split("/").pop();
    exerciseMenu.replaceChildren();
    [
      ["003_lettura.html", "Lettura"],
      ...Array.from({ length: 18 }, (_, index) => {
        const letter = String.fromCharCode(97 + index);
        return [`003_es_${letter}.html`, `Esercizio ${letter.toUpperCase()}`];
      })
    ].forEach(([file, title]) => {
      const option = document.createElement("option");
      option.value = file;
      option.textContent = title;
      option.selected = currentFile === file;
      exerciseMenu.appendChild(option);
    });
    exerciseMenu.setAttribute("aria-label", "Vai a una pagina dell’Unità 3");
  }

  if (window.firebase) {
    const originalDatabase = firebase.database.bind(firebase);
    firebase.database = function (...args) {
      const database = originalDatabase(...args);
      if (!database.__parloUnit3Scoped) {
        const originalRef = database.ref.bind(database);
        database.ref = path => {
          if (group && typeof path === "string" && /^esercizi\/unita3-/.test(path)) {
            path = `esercizi/gruppi/${safeGroup}/${path.slice("esercizi/".length)}`;
          }
          return originalRef(path);
        };
        database.__parloUnit3Scoped = true;
      }
      return database;
    };
  }
})();
