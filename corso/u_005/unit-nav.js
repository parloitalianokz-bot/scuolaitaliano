(() => {
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
  const script = document.createElement("script");
  script.src = "../shared/unit-navigation.js?v=1";
  document.head.appendChild(script);
})();
