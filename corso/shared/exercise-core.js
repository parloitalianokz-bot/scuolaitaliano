/* Utilità UI riutilizzabili per gli esercizi. */
(() => {
  "use strict";

  function normalizeAnswer(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[^a-z0-9']+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function attachCharacterToolbar(toolbar, getInput, canWrite = () => true) {
    ["'", "à", "è", "ì", "ò", "ù", "È"].forEach(character => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = character;
      button.setAttribute("aria-label", `Inserisci ${character === "'" ? "apostrofo" : character}`);
      button.addEventListener("mousedown", event => event.preventDefault());
      button.addEventListener("click", () => {
        const input = typeof getInput === "function" ? getInput() : null;
        if (!input || input.readOnly || input.disabled || !canWrite()) return;
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? start;
        if (typeof input.setRangeText === "function") {
          input.setRangeText(character, start, end, "end");
        } else {
          input.value = input.value.slice(0, start) + character + input.value.slice(end);
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
      });
      toolbar.appendChild(button);
    });
  }

  function initBackgroundParallax() {
    let pending = false;
    const update = () => {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const offset = reducedMotion ? 0 : Math.min(window.scrollY * 0.12, 180);
        document.body.style.setProperty("--background-offset", `${offset}px`);
        pending = false;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function bindSpeechButton(button, input, options = {}) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      button.disabled = true;
      button.title = "Il riconoscimento vocale non è disponibile in questo browser.";
      return () => {};
    }

    const recognition = new SpeechRecognition();
    recognition.lang = options.lang || "it-IT";
    recognition.continuous = false;
    recognition.interimResults = false;
    let listening = false;
    const startLabel = button.textContent;
    const onClick = () => {
      if (listening) {
        recognition.stop();
        return;
      }
      try { recognition.start(); } catch (error) { options.onError?.(error); }
    };
    recognition.onstart = () => {
      listening = true;
      button.setAttribute("aria-pressed", "true");
      if (options.listeningLabel) button.textContent = options.listeningLabel;
      options.onStart?.();
    };
    recognition.onresult = event => {
      const transcript = Array.from(event.results || []).map(result => result[0]?.transcript || "").join(" ").trim();
      if (!transcript) return;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      const prefix = start > 0 && !/\s$/.test(input.value.slice(0, start)) ? " " : "";
      if (typeof input.setRangeText === "function") {
        input.setRangeText(prefix + transcript, start, end, "end");
      } else {
        input.value = input.value.slice(0, start) + prefix + transcript + input.value.slice(end);
      }
      input.dispatchEvent(new Event("input", { bubbles: true }));
      options.onResult?.(transcript, input);
    };
    recognition.onerror = event => options.onError?.(event.error || event);
    recognition.onend = () => {
      listening = false;
      button.setAttribute("aria-pressed", "false");
      button.textContent = startLabel;
      options.onEnd?.();
    };
    button.addEventListener("click", onClick);
    return () => {
      button.removeEventListener("click", onClick);
      if (listening) recognition.abort();
    };
  }

  window.ParloExercise = Object.freeze({
    normalizeAnswer,
    attachCharacterToolbar,
    initBackgroundParallax,
    bindSpeechButton
  });
})();
