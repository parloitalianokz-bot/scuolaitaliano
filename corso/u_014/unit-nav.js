// Shim temporaneo per le pagine che usano ancora il vecchio nome.
(() => {
  const script = document.createElement("script");
  script.src = new URL("014_unit-nav.js", document.currentScript.src).href;
  document.head.appendChild(script);
})();
