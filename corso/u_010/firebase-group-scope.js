(() => {
  const params = new URLSearchParams(window.location.search);
  let session = {};
  try {
    session = JSON.parse(localStorage.getItem("parlo_session") || "{}");
  } catch (_) {}

  const group = params.get("gruppo") || session.group || "sconosciuto";
  const name = params.get("nome") || (!session.isTeacher ? session.name : "") || "";
  const safeGroup = group.replace(/[.#$\/\[\]]/g, "_");
  const safeName = name.replace(/[.#$\/\[\]]/g, "_");
  window.parloUnit10Session = { group, name, safeGroup, safeName, isTeacher: !!session.isTeacher };

  if (group !== "sconosciuto" && !params.has("gruppo")) params.set("gruppo", group);
  if (session.isTeacher) params.delete("nome");
  else if (name && !params.has("nome")) params.set("nome", name);
  if (params.toString() !== new URLSearchParams(window.location.search).toString()) {
    const query = params.toString();
    history.replaceState(history.state, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
  }

  if (name) {
    try { localStorage.setItem("parlo_student_name", name); } catch (_) {}
  }

  if (window.firebase) {
    const originalDatabase = firebase.database.bind(firebase);
    firebase.database = function (...args) {
      const database = originalDatabase(...args);
      if (!database.__parloUnit10Scoped) {
        const originalRef = database.ref.bind(database);
        database.ref = path => {
          if (typeof path === "string" && /^esercizi\/unita10-/.test(path)) {
            path = `esercizi/gruppi/${safeGroup}/${path.slice("esercizi/".length)}`;
          }
          return originalRef(path);
        };
        database.__parloUnit10Scoped = true;
      }
      return database;
    };
  }

  document.querySelectorAll('input[id*="student-name"], input[id="student-name"]').forEach(input => {
    if (name) input.value = name;
    const loginBox = input.closest(".login-box, .student-entry");
    if (loginBox) loginBox.style.display = "none";
  });
  const teacherToggle = document.getElementById("teacher-mode");
  if (teacherToggle) {
    const toggleLabel = teacherToggle.closest("label");
    if (toggleLabel) toggleLabel.style.display = "none";
  }

  const badge = document.getElementById("user-badge");
  if (badge) {
    badge.textContent = session.isTeacher
      ? `👩‍🏫 Insegnante · ${group}`
      : name ? `👤 ${group} · ${name}` : "";
    badge.hidden = !session.isTeacher && !name;
  }

  const exercisePages = [
    ["es_a.html", "Esercizio A"], ["es_b.html", "Esercizio B"],
    ["es_c.html", "Esercizio C"], ["es_d.html", "Esercizio D"],
    ["es_h.html", "Esercizio H"], ["es_i.html", "Esercizio I"],
    ["es_j.html", "Esercizio J"], ["es_k.html", "Esercizio K"],
    ["es_l.html", "Esercizio L"], ["es_m.html", "Esercizio M"],
    ["es_n.html", "Esercizio N"], ["es_o.html", "Esercizio O"],
    ["es_p.html", "Esercizio P"], ["es_q.html", "Esercizio Q"],
    ["es_r.html", "Esercizio R"], ["es_s.html", "Esercizio S"],
    ["es_t.html", "Esercizio T"]
  ];
  const exerciseNavigation = document.querySelector(".home-navigation");
  if (exerciseNavigation) {
    let homeLink = Array.from(exerciseNavigation.querySelectorAll("a")).find(link =>
      /index\.html$/i.test(new URL(link.href, window.location.href).pathname)
      || /torna all.inizio|\binizio\b/i.test(link.textContent)
      || link.classList.contains("home-link")
    );

    if (!homeLink) {
      homeLink = document.createElement("a");
      exerciseNavigation.prepend(homeLink);
    }
    homeLink.href = "../index.html";
    homeLink.classList.add("home-link");
    homeLink.setAttribute("aria-label", "Torna alla pagina iniziale");
    homeLink.title = "Home";
    homeLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="currentColor" d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z"/></svg>';
    Object.assign(homeLink.style, {
      width: "42px", justifyContent: "center", padding: "8px", flexShrink: "0"
    });
  }

  if (exerciseNavigation && !document.getElementById("exercise-navigation-menu")) {
    const label = document.createElement("label");
    label.htmlFor = "exercise-navigation-menu";
    label.textContent = "Vai a un esercizio dell’Unità 10";
    Object.assign(label.style, {
      position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px",
      overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: "0"
    });

    const menu = document.createElement("select");
    menu.id = "exercise-navigation-menu";
    menu.setAttribute("aria-label", label.textContent);
    Object.assign(menu.style, {
      minHeight: "42px", maxWidth: "100%", padding: "8px 14px",
      border: "1px solid #d8e5d8", borderRadius: "10px",
      background: "rgba(255,254,250,.94)", color: "#2f5739",
      font: "inherit", fontWeight: "700", cursor: "pointer"
    });
    exercisePages.forEach(([file, title]) => {
      const option = document.createElement("option");
      option.value = file;
      option.textContent = title;
      option.selected = window.location.pathname.endsWith(`/${file}`);
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
    exerciseNavigation.append(label, menu);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (teacherToggle && session.isTeacher) {
      teacherToggle.checked = true;
      teacherToggle.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, { once: true });
})();
