(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };
  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 48,
    exercises: [
      { value: "048_lettura.html", label: "Lettura" },
      ..."abcdefghi".split("").map(letter => ({ value: `048_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: []
  };
  load("../shared/unit-navigation.js?v=1");
})();
