(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };
  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 54,
    exercises: [
      { value: "054_lettura.html", label: "Lettura" },
      ..."abcdefghijk".split("").map(letter => ({ value: `054_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: []
  };
  load("../shared/unit-navigation.js?v=1");
})();
