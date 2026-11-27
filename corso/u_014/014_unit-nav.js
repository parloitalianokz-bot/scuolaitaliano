(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };
  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 14,
    exercises: [
      { value: "014_lettura.html", label: "Lettura" },
      ..."abcdefghijklm".split("").map(letter => ({ value: `014_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: [{ value: "verbo_sapere.html", label: "Il verbo modale sapere" }]
  };
  load("../shared/unit-navigation.js?v=1");
})();
