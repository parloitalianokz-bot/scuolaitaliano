(() => {
  "use strict";

  const config = window.PARLO_UNIT_NAV;
  if (!config) return;

  const currentFile = decodeURIComponent(location.pathname.split("/").pop() || "");
  const unitNumber = String(config.unitNumber || "").replace(/\D/g, "");
  const unitLabel = unitNumber ? `Unità ${Number(unitNumber)}` : "unità";

  function createMenu(id, label, ariaLabel, placeholder) {
    const fieldLabel = document.createElement("label");
    fieldLabel.className = "visually-hidden";
    fieldLabel.htmlFor = id;
    fieldLabel.textContent = label;

    const select = document.createElement("select");
    select.id = id;
    select.setAttribute("aria-label", ariaLabel);
    select.append(new Option(placeholder, ""));
    return [fieldLabel, select];
  }

  function ensureNavigation() {
    const mount = document.getElementById("unit-navigation");
    if (!mount) return;

    const nav = document.createElement("nav");
    nav.className = "top-exercises";
    nav.setAttribute("aria-label", `Menu dell’${unitLabel}`);

    const home = document.createElement("a");
    home.id = "home-link";
    home.className = "home-link";
    home.href = "../index.html";
    home.setAttribute("aria-label", "Torna alla pagina iniziale");
    home.title = "Home";
    home.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z"/></svg>';

    const badge = document.createElement("span");
    badge.id = "user-badge";
    badge.setAttribute("aria-live", "polite");
    const session = window.ParloSession || {};
    if (session.group && session.group !== "sconosciuto") {
      badge.textContent = `${session.isTeacher ? "👩‍🏫" : "👤"} ${session.group}${session.name && !session.isTeacher ? ` · ${session.name}` : ""}`;
    }

    const exerciseMenu = createMenu(
      "exercise-menu",
      `Seleziona una pagina dell’${unitLabel}`,
      `Pagine dell’${unitLabel}`,
      "Esercizi"
    );
    const grammarMenu = createMenu(
      "grammar-menu",
      "Seleziona una scheda grammaticale",
      "Schede grammaticali",
      "Grammatica"
    );

    nav.append(home, badge, ...exerciseMenu, ...grammarMenu);
    mount.replaceWith(nav);
  }

  function fillMenu(id, entries, placeholder) {
    const select = document.getElementById(id);
    if (!select) return;

    const firstOption = select.options[0];
    const emptyOption = firstOption?.value === ""
      ? new Option(firstOption.textContent || placeholder, "")
      : new Option(placeholder, "");
    select.replaceChildren(emptyOption);

    (Array.isArray(entries) ? entries : []).forEach(entry => {
      if (!entry || typeof entry.value !== "string" || typeof entry.label !== "string") return;
      select.add(new Option(entry.label, entry.value));
    });

    if ([...select.options].some(option => option.value === currentFile)) {
      select.value = currentFile;
    }

    if (select.dataset.parloNavBound !== "true") {
      select.dataset.parloNavBound = "true";
      select.addEventListener("change", event => {
        const value = event.currentTarget.value;
        if (!value) return;
        const target = window.ParloExercise?.withSessionParams
          ? window.ParloExercise.withSessionParams(value).href
          : new URL(value, location.href).href;
        location.assign(target);
      });
    }
  }

  function render() {
    ensureNavigation();
    fillMenu("exercise-menu", config.exercises, "Esercizi");
    fillMenu("grammar-menu", config.grammar, "Grammatica");
    window.ParloExercise?.decorateSessionLinks?.();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
