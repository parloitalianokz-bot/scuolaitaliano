(() => {
  const params = new URLSearchParams(window.location.search);
  let session = {};
  try {
    session = JSON.parse(localStorage.getItem("parlo_session") || "{}");
  } catch (_) {}

  const group = session.group || params.get("gruppo") || "sconosciuto";
  const isTeacher = Boolean(session.isTeacher);
  const name = isTeacher ? (session.teacher || session.name || "Insegnante") : (session.name || params.get("nome") || "");
  const safe = value => value.replace(/[.#$\/\[\]]/g, "_");
  const safeGroup = safe(group);
  window.parloUnit11Session = { group, name, safeGroup, isTeacher };

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

  // Gli esercizi dell'Unità 11 restano isolati nel ramo Firebase del gruppo corrente.
  if (window.firebase) {
    const originalDatabase = firebase.database.bind(firebase);
    firebase.database = function (...args) {
      const database = originalDatabase(...args);
      if (!database.__parloUnit11Scoped) {
        const originalRef = database.ref.bind(database);
        database.ref = path => {
          if (typeof path === "string" && /^esercizi\/unita11-/.test(path)) {
            path = `esercizi/gruppi/${safeGroup}/${path.slice("esercizi/".length)}`;
          }
          return originalRef(path);
        };
        database.__parloUnit11Scoped = true;
      }
      return database;
    };
  }

  document.querySelectorAll(".login-box, .student-entry").forEach(box => { box.hidden = true; });

  const exercisePages = [
    ["011_lettura.html", "Lettura"],
    ...Array.from({ length: 15 }, (_, index) => {
      const letter = String.fromCharCode(97 + index);
      return [`es_${letter}.html`, `Esercizio ${letter.toUpperCase()}`];
    })
  ];
  let navigation = document.querySelector(".home-navigation, .top-exercises");
  if (!navigation) {
    navigation = document.createElement("nav");
    navigation.className = "home-navigation";
    navigation.setAttribute("aria-label", "Navigazione dell’Unità 11");
    (document.querySelector("main") || document.body).prepend(navigation);
  }
  Object.assign(navigation.style, {
    display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px"
  });
  navigation.replaceChildren();

  const homeLink = document.createElement("a");
  homeLink.href = "../index.html";
  homeLink.setAttribute("aria-label", "Torna alla pagina iniziale");
  homeLink.title = "Home";
  homeLink.textContent = "⌂";
  Object.assign(homeLink.style, {
    display: "inline-flex", alignItems: "center", justifyContent: "center", width: "42px", minWidth: "42px",
    minHeight: "42px", padding: "8px", border: "1px solid #d8e5d8", borderRadius: "10px",
    background: "rgba(255,254,250,.94)", color: "#2f5739", fontSize: "1.25rem", fontWeight: "700", textDecoration: "none"
  });
  navigation.appendChild(homeLink);

  let badge = document.getElementById("user-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.id = "user-badge";
  }
  badge.textContent = `${isTeacher ? "👩‍🏫" : "👤"} ${name || "Utente"} · ${group}`;
  badge.setAttribute("aria-live", "polite");
  Object.assign(badge.style, {
    display: "inline-flex", alignItems: "center", minHeight: "36px", padding: "6px 12px",
    border: "1px solid #d8e5d8", borderRadius: "10px", background: "rgba(255,254,250,.94)",
    color: "#2f5739", fontSize: ".85rem", fontWeight: "700"
  });

  const label = document.createElement("label");
  label.htmlFor = "unit11-exercise-menu";
  label.textContent = "Vai a una pagina dell’Unità 11";
  Object.assign(label.style, {
    position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px",
    overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: "0"
  });

  const menu = document.createElement("select");
  menu.id = "unit11-exercise-menu";
  menu.setAttribute("aria-label", label.textContent);
  Object.assign(menu.style, {
    minHeight: "42px", maxWidth: "100%", marginLeft: "auto", padding: "8px 14px",
    border: "1px solid #d8e5d8", borderRadius: "10px", background: "rgba(255,254,250,.94)",
    color: "#2f5739", font: "inherit", fontWeight: "700", cursor: "pointer"
  });
  const currentFile = window.location.pathname.split("/").pop();
  exercisePages.forEach(([file, title]) => {
    const option = document.createElement("option");
    option.value = file;
    option.textContent = title;
    option.selected = currentFile === file;
    menu.appendChild(option);
  });
  menu.addEventListener("change", () => {
    const target = new URL(menu.value, window.location.href);
    const currentParams = new URLSearchParams(window.location.search);
    ["gruppo", "nome"].forEach(key => {
      if (currentParams.has(key)) target.searchParams.set(key, currentParams.get(key));
    });
    window.location.assign(`${target.pathname}${target.search}${target.hash}`);
  });
  navigation.append(badge, label, menu);

  const notesScript = document.createElement("script");
  notesScript.src = "../classroom-notes.js";
  document.body.appendChild(notesScript);
})();
