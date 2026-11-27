(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };
  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 3,
    exercises: [
      { value: "003_lettura.html", label: "Lettura" },
      ..."abcdefghijklmnopqr".split("").map(letter => ({ value: `003_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: [{ value: "003_verbi_riflessivi.html", label: "I verbi riflessivi" }]
  };
  load("../shared/unit-navigation.js?v=1");
})();
