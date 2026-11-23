window.PARLO_UNIT_NAV = {
  exercises: [
    { value: "054_lettura.html", label: "Lettura" },
    { value: "054_es_a.html", label: "Esercizio A" },
    { value: "054_es_b.html", label: "Esercizio B" },
    { value: "054_es_c.html", label: "Esercizio C" },
    { value: "054_es_d.html", label: "Esercizio D" },
    { value: "054_es_e.html", label: "Esercizio E" },
    { value: "054_es_f.html", label: "Esercizio F" },
    { value: "054_es_g.html", label: "Esercizio G" },
    { value: "054_es_h.html", label: "Esercizio H" },
    { value: "054_es_i.html", label: "Esercizio I" },
    { value: "054_es_j.html", label: "Esercizio J" },
    { value: "054_es_k.html", label: "Esercizio K" }
  ],
  grammar: []
};

(() => {
  const mount = document.getElementById("unit-navigation");
  if (!mount) return;

  const currentPage = decodeURIComponent(location.pathname.split("/").pop() || "");
  const nav = document.createElement("nav");
  nav.className = "top-exercises";
  nav.setAttribute("aria-label", "Menu dell’Unità 54");

  const home = document.createElement("a");
  home.id = "home-link";
  home.className = "home-link";
  home.href = "../index.html";
  home.setAttribute("aria-label", "Torna alla pagina iniziale");
  home.title = "Home";
  home.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z"/></svg>';
  nav.append(home);

  const badge = document.createElement("span");
  badge.id = "user-badge";
  badge.setAttribute("aria-live", "polite");
  nav.append(badge);

  const addMenu = (id, label, ariaLabel, placeholder, entries) => {
    const fieldLabel = document.createElement("label");
    fieldLabel.className = "visually-hidden";
    fieldLabel.htmlFor = id;
    fieldLabel.textContent = label;

    const select = document.createElement("select");
    select.id = id;
    select.setAttribute("aria-label", ariaLabel);
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = placeholder;
    select.append(emptyOption);

    entries.forEach(entry => {
      const option = document.createElement("option");
      option.value = entry.value;
      option.textContent = entry.label;
      option.selected = entry.value === currentPage;
      select.append(option);
    });

    nav.append(fieldLabel, select);
  };

  addMenu("exercise-menu", "Seleziona una pagina dell’Unità 54", "Pagine dell’Unità 54", "Esercizi", window.PARLO_UNIT_NAV.exercises);
  addMenu("grammar-menu", "Seleziona una scheda grammaticale", "Schede grammaticali", "Grammatica", window.PARLO_UNIT_NAV.grammar);
  mount.replaceWith(nav);

  const bindNavigation = () => {
    if (!window.ParloExercise) return;
    window.ParloExercise.decorateSessionLinks?.();
    window.ParloExercise.bindNavigationSelect?.(document.getElementById("exercise-menu"));
    window.ParloExercise.bindNavigationSelect?.(document.getElementById("grammar-menu"));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindNavigation, { once: true });
  } else {
    bindNavigation();
  }
})();
