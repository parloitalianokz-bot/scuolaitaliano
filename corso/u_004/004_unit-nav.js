(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };
  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 4,
    exercises: [
      { value: "004_lettura.html", label: "Lettura" },
      ..."abcdefghijk".split("").map(letter => ({ value: `004_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: [
      { value: "prepart.html", label: "Preposizioni articolate" },
      { value: "stare.html", label: "Verbo stare" }
    ]
  };
  load("../shared/unit-navigation.js?v=1");
})();
