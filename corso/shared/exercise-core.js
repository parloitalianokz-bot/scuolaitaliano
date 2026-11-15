/* Utilità UI riutilizzabili per letture, grammatica ed esercizi. */
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

  /* Riproduzione audio paragrafo: prova prima MP3 locale, poi TTS (con priorità voci Google locali) */
  function bindReadingAudio(button, getPayload) {
    if (!button) return () => {};

    let currentAudio = null;
    let italianVoice = null;
    let isPlaying = false;

    const resolveVoice = () => {
      if (!("speechSynthesis" in window)) return null;
      const voices = window.speechSynthesis.getVoices();
      const itVoices = voices.filter(v => /^it([-_]|$)/i.test(v.lang) || /italiano/i.test(v.name));
      italianVoice =
        itVoices.find(v => /google/i.test(v.name) && /local/i.test(v.name)) ||
        itVoices.find(v => /google/i.test(v.name) && !/espeak/i.test(v.name)) ||
        itVoices.find(v => !/espeak/i.test(v.name)) ||
        itVoices[0] ||
        null;
      return italianVoice;
    };

    if ("speechSynthesis" in window) {
      resolveVoice();
      window.speechSynthesis.addEventListener("voiceschanged", resolveVoice);
    }

    const resetUI = () => {
      isPlaying = false;
      button.setAttribute("aria-pressed", "false");
      button.textContent = "🔊 Ascolta";
    };

    const stop = () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }
      if ("speechSynthesis" in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
        window.speechSynthesis.cancel();
      }
      resetUI();
    };

    const startTTS = text => {
      if (!("speechSynthesis" in window) || !text) {
        resetUI();
        return;
      }

      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const voice = italianVoice || resolveVoice();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voice?.lang || "it-IT";
      if (voice) utterance.voice = voice;
      utterance.rate = 0.94;

      isPlaying = true;
      button.setAttribute("aria-pressed", "true");
      button.textContent = "⏹ Ferma";

      utterance.onend = resetUI;
      utterance.onerror = event => {
        console.warn("TTS error:", event?.error);
        resetUI();
      };

      window.speechSynthesis.speak(utterance);
    };

    button.addEventListener("click", () => {
      if (isPlaying) {
        stop();
        return;
      }
      const { audioSrc, text } = getPayload() || {};
      if (!audioSrc) {
        startTTS(text);
        return;
      }

      const audio = new Audio(audioSrc);
      currentAudio = audio;
      isPlaying = true;
      button.setAttribute("aria-pressed", "true");
      button.textContent = "⏹ Ferma";

      audio.addEventListener("ended", resetUI, { once: true });
      audio.addEventListener("error", () => {
        currentAudio = null;
        startTTS(text);
      }, { once: true });

      audio.play().catch(() => {
        currentAudio = null;
        startTTS(text);
      });
    });

    return stop;
  }

  /* Gestione universale tooltip (touch/click + allineamento automatico ai bordi dello schermo) */
  let tooltipsInitialized = false;
  function initTooltips() {
    if (tooltipsInitialized) return;
    tooltipsInitialized = true;

    const SELECTOR = ".vocab-tip, .has-tooltip";
    let openTip = null;

    function adjustTooltipPosition(element) {
      if (!element) return;
      element.style.setProperty("--tip-shift", "0px");
      const rect = element.getBoundingClientRect();
      const text = element.getAttribute("data-tip") || element.getAttribute("data-tooltip") || "";
      const estimatedWidth = Math.min(Math.max(text.length * 7.5 + 28, 120), Math.min(290, window.innerWidth - 24));
      const halfWidth = estimatedWidth / 2;
      const centerX = rect.left + rect.width / 2;
      const margin = 12;

      let shift = 0;
      if (centerX - halfWidth < margin) {
        shift = margin - (centerX - halfWidth);
      } else if (centerX + halfWidth > window.innerWidth - margin) {
        shift = (window.innerWidth - margin) - (centerX + halfWidth);
      }
      element.style.setProperty("--tip-shift", `${Math.round(shift)}px`);
    }

    function closeOpenTip() {
      if (!openTip) return;
      openTip.classList.remove("is-open");
      openTip = null;
    }

    document.addEventListener("pointerenter", event => {
      const target = event.target instanceof Element ? event.target.closest(SELECTOR) : null;
      if (target) adjustTooltipPosition(target);
    }, true);

    document.addEventListener("focusin", event => {
      const target = event.target instanceof Element ? event.target.closest(SELECTOR) : null;
      if (target) adjustTooltipPosition(target);
    });

    document.addEventListener("click", event => {
      const target = event.target instanceof Element ? event.target.closest(SELECTOR) : null;
      if (!target) {
        closeOpenTip();
        return;
      }
      if (openTip === target) {
        closeOpenTip();
      } else {
        closeOpenTip();
        adjustTooltipPosition(target);
        target.classList.add("is-open");
        openTip = target;
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeOpenTip();
    });

    window.addEventListener("resize", () => {
      if (openTip) adjustTooltipPosition(openTip);
    }, { passive: true });
  }

  function getSessionParams() {
    const params = new URLSearchParams(location.search);
    try {
      const session = JSON.parse(localStorage.getItem("parlo_session") || "null");
      if (!params.has("gruppo") && session?.group) params.set("gruppo", session.group);
      if (!params.has("nome") && !session?.isTeacher && session?.name && session.name !== "Insegnante") {
        params.set("nome", session.name);
      }
    } catch (_) {}
    return params;
  }

  function withSessionParams(urlLike) {
    const target = new URL(urlLike, location.href);
    const params = getSessionParams();
    ["gruppo", "nome"].forEach(key => {
      const value = params.get(key);
      if (value && value !== "sconosciuto" && !(key === "nome" && value === "Insegnante")) {
        target.searchParams.set(key, value);
      }
    });
    return target;
  }

  function decorateSessionLinks(selector = "a[href]") {
    document.querySelectorAll(selector).forEach(link => {
      const rawHref = link.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#") || /^(mailto:|tel:|https?:)/i.test(rawHref)) return;
      const target = withSessionParams(rawHref);
      link.href = `${target.pathname}${target.search}${target.hash}`;
    });
  }

  function bindNavigationSelect(select) {
    if (!select) return;
    select.addEventListener("change", event => {
      if (!event.target.value) return;
      location.href = withSessionParams(event.target.value).href;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTooltips, { once: true });
  } else {
    initTooltips();
  }

  window.ParloExercise = Object.freeze({
    normalizeAnswer,
    attachCharacterToolbar,
    initBackgroundParallax,
    bindSpeechButton,
    bindReadingAudio,
    initTooltips,
    getSessionParams,
    withSessionParams,
    decorateSessionLinks,
    bindNavigationSelect
  });
})();