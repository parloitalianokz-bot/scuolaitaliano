(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  };

  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 7,
    exercises: [
      { value: "007_lettura.html", label: "Lettura" },
      ..."abcdefghijklm".split("").map(letter => ({
        value: `007_es_${letter}.html`,
        label: `Esercizio ${letter.toUpperCase()}`
      })),
      { value: "007_autovalutazione.html", label: "Autovalutazione finale" }
    ],
    grammar: [
      { value: "andare.html", label: "Il verbo andare" }
    ]
  };

  load("../shared/unit-navigation.js?v=1");
})();
