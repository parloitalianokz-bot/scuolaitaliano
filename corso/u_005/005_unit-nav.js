(() => {
  const load = src => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  };

  load("../shared/access-guard.js?v=3");

  window.PARLO_UNIT_NAV = {
    unitNumber: 5,
    exercises: [
      { value: "005_lettura.html", label: "Lettura" },
      ..."abcdefghijklmn".split("").map(letter => ({ value: `005_es_${letter}.html`, label: `Esercizio ${letter.toUpperCase()}` }))
    ],
    grammar: [
      { value: "esserci.html", label: "Verbo esserci" },
      { value: "ordinali.html", label: "I numeri ordinali" }
    ]
  };
  load("../shared/unit-navigation.js?v=1");
})();
