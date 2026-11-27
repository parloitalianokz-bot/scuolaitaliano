(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };

  window.PARLO_UNIT_NAV = {
    unitNumber: 6,
    exercises: [
      { value: "006_lettura.html", label: "Lettura" },
      ..."abcdefghijklmno".split("").map(letter => ({ value: `006_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: []
  };
  load("../shared/unit-navigation.js?v=1");
})();
