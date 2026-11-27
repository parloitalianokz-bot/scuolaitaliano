(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  };

  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 1,
    exercises: [
      { value: "001_lettura.html", label: "Lettura" },
      ..."abcdefghijk".split("").map(letter => ({
        value: `001_es_${letter}.html`,
        label: `Esercizio ${letter.toUpperCase()}`
      }))
    ],
    grammar: [
      { value: "001_verbo_essere.html", label: "Il verbo essere" },
      { value: "001_genere.html", label: "Il genere del sostantivo" },
      { value: "001_indeterminativi.html", label: "Articoli indeterminativi" },
      { value: "001_plurale.html", label: "Il numero del sostantivo · Il plurale" },
      { value: "001_determinativi.html", label: "Articoli determinativi" }
    ]
  };

  load("../shared/unit-navigation.js?v=1");
})();
