(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };
  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 2,
    exercises: [
      { value: "002_lettura.html", label: "Lettura" },
      ..."abcdefghijklm".split("").map(letter => ({ value: `002_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: [
      { value: "002_numeri.html", label: "I numeri" },
      { value: "002_verbo_avere.html", label: "Il verbo avere" }
    ]
  };
  load("../shared/unit-navigation.js?v=1");
})();
