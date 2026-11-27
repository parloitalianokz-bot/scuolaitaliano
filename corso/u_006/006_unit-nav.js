(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  };

  load("../shared/access-guard.js?v=3");

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
