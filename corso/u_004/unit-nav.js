window.PARLO_UNIT_NAV = {
  exercises: [
    { value: "004_lettura.html", label: "Lettura" },
    { value: "004_es_a.html", label: "Esercizio A" },
    { value: "004_es_b.html", label: "Esercizio B" },
    { value: "004_es_c.html", label: "Esercizio C" },
    { value: "004_es_d.html", label: "Esercizio D" },
    { value: "004_es_e.html", label: "Esercizio E" },
    { value: "004_es_f.html", label: "Esercizio F" },
    { value: "004_es_g.html", label: "Esercizio G" },
    { value: "004_es_h.html", label: "Esercizio H" },
    { value: "004_es_i.html", label: "Esercizio I" },
    { value: "004_es_j.html", label: "Esercizio J" },
    { value: "004_es_k.html", label: "Esercizio K" }
  ],
  grammar: [
    { value: "prepart.html", label: "Preposizioni articolate" },
    { value: "stare.html", label: "Verbo stare" }
  ]
};

(() => {
  const mount = document.getElementById("unit-navigation");
  if (!mount) return;

  const currentPage = decodeURIComponent(location.pathname.split("/").pop() || "");
  const nav = document.createElement("nav");
  nav.className = "top-exercises";
  nav.setAttribute("aria-label", "Menu dell’Unità 4");

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

  addMenu("exercise-menu", "Seleziona una pagina dell’Unità 4", "Pagine dell’Unità 4", "Esercizi", window.PARLO_UNIT_NAV.exercises);
  addMenu("grammar-menu", "Seleziona una scheda grammaticale", "Schede grammaticali", "Grammatica", window.PARLO_UNIT_NAV.grammar);
  mount.replaceWith(nav);

  const bindNavigation = () => {
    const exercise = document.getElementById("exercise-menu");
    const grammar = document.getElementById("grammar-menu");
    if (!window.ParloExercise) return;
    window.ParloExercise.decorateSessionLinks?.();
    window.ParloExercise.bindNavigationSelect?.(exercise);
    window.ParloExercise.bindNavigationSelect?.(grammar);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindNavigation, { once: true });
  } else {
    bindNavigation();
  }
})();
