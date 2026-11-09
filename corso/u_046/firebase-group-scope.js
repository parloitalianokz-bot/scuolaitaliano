(() => {
  const params = new URLSearchParams(window.location.search);
  let session = {};
  try {
    session = JSON.parse(localStorage.getItem("parlo_session") || "{}");
  } catch (_) {}

  // L'accesso principale è l'unica fonte di identità e gruppo.
  const group = session.group || "sconosciuto";
  const isTeacher = !!session.isTeacher;
  const name = isTeacher
    ? (session.teacher || session.name || "Insegnante")
    : (session.name || "");
  const safeGroup = group.replace(/[.#$\/\[\]]/g, "_");
  window.parloUnit46Session = { group, name, safeGroup, isTeacher };

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

  // Isola tutte le letture e scritture dell'unità nel ramo Firebase del gruppo corrente.
  if (window.firebase) {
    const originalDatabase = firebase.database.bind(firebase);
    firebase.database = function (...args) {
      const database = originalDatabase(...args);
      if (!database.__parloUnit46Scoped) {
        const originalRef = database.ref.bind(database);
        database.ref = path => {
          if (typeof path === "string" && /^esercizi\/unita46-/.test(path)) {
            path = `esercizi/gruppi/${safeGroup}/${path.slice("esercizi/".length)}`;
          }
          return originalRef(path);
        };
        database.__parloUnit46Scoped = true;
      }
      return database;
    };
  }

  // Nelle unità l'identità proviene dal login principale, non da un secondo form.
  document.querySelectorAll(".login-box, .student-entry").forEach(box => { box.hidden = true; });

  const exercisePages = [
    ["046_lettura.html", "Lettura"],
    ...Array.from({ length: 9 }, (_, index) => {
      const letter = String.fromCharCode(97 + index);
      return [`es_${letter}.html`, `Esercizio ${letter.toUpperCase()}`];
    })
  ];

  let navigation = document.querySelector(".home-navigation, .top-exercises");
  if (!navigation) {
    navigation = document.createElement("nav");
    navigation.className = "home-navigation";
    navigation.setAttribute("aria-label", "Navigazione dell’Unità 46");
    (document.querySelector("main") || document.body).prepend(navigation);
  }
  Object.assign(navigation.style, {
    display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px"
  });
  navigation.replaceChildren();

  const homeLink = document.createElement("a");
  homeLink.href = "../index.html";
  homeLink.className = "home-link";
  homeLink.setAttribute("aria-label", "Torna alla pagina iniziale");
  homeLink.title = "Home";
  homeLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="currentColor" d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z"/></svg>';
  Object.assign(homeLink.style, {
    display: "inline-flex", alignItems: "center", justifyContent: "center", width: "42px", minWidth: "42px",
    minHeight: "42px", padding: "8px", border: "1px solid #d8e5d8", borderRadius: "10px",
    background: "rgba(255,254,250,.94)", color: "#2f5739", textDecoration: "none"
  });
  navigation.appendChild(homeLink);

  // Riutilizza il badge della lettura e lo colloca nella stessa barra di tutte le pagine.
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
  label.htmlFor = "unit46-exercise-menu";
  label.textContent = "Vai a una pagina dell’Unità 46";
  Object.assign(label.style, {
    position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px",
    overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: "0"
  });

  const menu = document.createElement("select");
  menu.id = "unit46-exercise-menu";
  menu.setAttribute("aria-label", label.textContent);
  Object.assign(menu.style, {
    minHeight: "42px", maxWidth: "100%", marginLeft: "auto", padding: "8px 14px",
    border: "1px solid #d8e5d8", borderRadius: "10px",
    background: "rgba(255,254,250,.94)", color: "#2f5739",
    font: "inherit", fontWeight: "700", cursor: "pointer"
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
})();
