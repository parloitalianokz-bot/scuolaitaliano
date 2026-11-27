(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };
  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 11,
    exercises: [
      { value: "011_lettura.html", label: "Lettura" },
      ..."abcdefghijklmno".split("").map(letter => ({ value: `011_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: [{ value: "011_progressivo.html", label: "Il presente progressivo" }]
  };
  load("../shared/unit-navigation.js?v=1");
})();
