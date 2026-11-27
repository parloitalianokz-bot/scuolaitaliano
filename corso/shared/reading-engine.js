(() => {
  "use strict";


  const FIREBASE_CONFIG = {
    authDomain: "esercizi-parlo-italiano.firebaseapp.com",
    databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esercizi-parlo-italiano"
  };

  function ensureFirebaseReady() {
    if (!window.firebase) return;
    if (window.ParloModes && typeof window.ParloModes.initFirebase === "function") {
      window.ParloModes.initFirebase();
      return;
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
  }

  function applyUnitImages() {
    const rootStyle = document.documentElement.style;
    const customBg = rootStyle.getPropertyValue("--reading-bg").trim();
    const customBanner = rootStyle.getPropertyValue("--reading-banner").trim();

    const bgUrl = customBg || `url("${new URL("img/sfondo.jpeg", location.href).href}")`;
    const bannerUrl = customBanner || `url("${new URL("img/banner.png", location.href).href}")`;

    rootStyle.setProperty("--reading-bg", bgUrl);
    rootStyle.setProperty("--reading-banner", bannerUrl);

    const bannerEl = document.querySelector(".banner");
    if (bannerEl && !bannerEl.style.backgroundImage) {
      bannerEl.style.backgroundImage = bannerUrl;
    }
  }

  function populateUnitMenus() {
    const nav = window.PARLO_UNIT_NAV;
    if (!nav) return;

    const currentFile = location.pathname.split("/").pop() || "";

    const fillSelect = (selectEl, items) => {
      if (!selectEl || !Array.isArray(items) || selectEl.options.length > 1) return;
      items.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.value;
        opt.textContent = item.label;
        if (item.value === currentFile) opt.selected = true;
        selectEl.appendChild(opt);
      });
    };

    fillSelect(document.getElementById("exercise-menu"), nav.exercises);
    fillSelect(document.getElementById("grammar-menu"), nav.grammar);
  }

  function inferPageKey() {
    const bodyKey = document.body?.dataset?.pageKey;
    if (bodyKey) return bodyKey;
    const file = location.pathname.split("/").pop() || "";
    const clean = file.replace(/\.html?$/i, "");
    return clean || "lettura";
  }

  function ensureReadingChrome(readingCard, pageKey) {
    let stepsNav = document.getElementById("reading-steps");
    if (!stepsNav) {
      stepsNav = document.createElement("nav");
      stepsNav.id = "reading-steps";
      stepsNav.className = "reading-steps";
      stepsNav.setAttribute("aria-label", "Vai direttamente a una parte della lettura");
      const anchor = document.querySelector(".video-card") || readingCard;
      anchor.parentNode.insertBefore(stepsNav, anchor);
    }

    let listenButton = document.getElementById("listen-paragraph");
    if (!listenButton) {
      const tools = document.createElement("div");
      tools.className = "reading-tools";
      listenButton = document.createElement("button");
      listenButton.id = "listen-paragraph";
      listenButton.className = "audio-btn";
      listenButton.type = "button";
      listenButton.setAttribute("aria-pressed", "false");
      listenButton.textContent = "🔊 Ascolta";
      tools.appendChild(listenButton);
      readingCard.prepend(tools);
    }

    let glossaryBox = document.getElementById("paragraph-glossary");
    let glossaryList = document.getElementById("glossary-list");
    if (!glossaryBox) {
      glossaryBox = document.createElement("details");
      glossaryBox.id = "paragraph-glossary";
      glossaryBox.className = "glossary-box";
      glossaryBox.hidden = true;
      const summary = document.createElement("summary");
      summary.textContent = "📖 Parole nuove di questo paragrafo";
      glossaryList = document.createElement("ul");
      glossaryList.id = "glossary-list";
      glossaryList.className = "glossary-list";
      glossaryBox.append(summary, glossaryList);
      readingCard.appendChild(glossaryBox);
    }

    let nav = document.querySelector(".reading-navigation");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "reading-navigation";
      nav.setAttribute("aria-label", "Navigazione del racconto");

      const prevBtn = document.createElement("button");
      prevBtn.id = "previous-paragraph";
      prevBtn.type = "button";
      prevBtn.textContent = "← Precedente";

      const progress = document.createElement("span");
      progress.id = "reading-progress";
      progress.className = "reading-progress";
      progress.setAttribute("role", "status");
      progress.setAttribute("aria-live", "polite");

      const nextBtn = document.createElement("button");
      nextBtn.id = "next-paragraph";
      nextBtn.type = "button";
      nextBtn.textContent = "Successivo →";

      const unitPrefix = pageKey.replace(/_lettura$/i, "");
      const nextHref = document.body?.dataset?.nextHref || `${unitPrefix}_es_a.html`;
      const nextLabel = document.body?.dataset?.nextLabel || "Vai all’esercizio A →";
      const exLink = document.createElement("a");
      exLink.id = "exercise-a-link";
      exLink.href = nextHref;
      exLink.hidden = true;
      exLink.textContent = nextLabel;

      nav.append(prevBtn, progress, nextBtn, exLink);
      readingCard.after(nav);
    }

    return {
      stepsNav,
      listenButton,
      glossaryBox,
      glossaryList,
      previousParagraphButton: document.getElementById("previous-paragraph"),
      nextParagraphButton: document.getElementById("next-paragraph"),
      exerciseALink: document.getElementById("exercise-a-link"),
      readingProgress: document.getElementById("reading-progress")
    };
  }

    function initReadingPage() {
    const readingCard = document.querySelector(".reading");
    if (!readingCard) return;

    const session = window.ParloSession || {};
    const isPersonalPractice = !session.isTeacher && ["distance", "individual"].includes(session.activityMode);

    applyUnitImages();
    if (!isPersonalPractice) ensureFirebaseReady();

    const pageKey = inferPageKey();
    const storyParagraphs = Array.from(readingCard.querySelectorAll(":scope > p"));
    const videoCard = document.querySelector(".video-card");
    const iframe = videoCard ? videoCard.querySelector("iframe") : null;
    const hasVideo = Boolean(iframe && /^https?:\/\//i.test(iframe.getAttribute("src") || ""));
    if (videoCard && !hasVideo) videoCard.remove();

    const {
      stepsNav,
      listenButton,
      glossaryBox,
      glossaryList,
      previousParagraphButton,
      nextParagraphButton,
      exerciseALink,
      readingProgress
    } = ensureReadingChrome(readingCard, pageKey);

    let currentSlide = 0;
    const totalSlides = storyParagraphs.length + (hasVideo ? 1 : 0);

        const mediaSync = !isPersonalPractice && window.ParloMediaSync
      ? window.ParloMediaSync.createMediaSync({
          pageKey,
          insertBefore: stepsNav,
          onRemoteSlide: slideIndex => showSlide(slideIndex, { fromRemote: true })
        })
      : null;

    const stopSpeech = window.ParloExercise?.bindReadingAudio
      ? ParloExercise.bindReadingAudio(
          listenButton,
          () => {
            const paragraphIndex = hasVideo ? currentSlide - 1 : currentSlide;
            const activeParagraph = storyParagraphs[paragraphIndex];
            if (!activeParagraph) return null;
            const customAudio = activeParagraph.dataset.audio;
            return {
              audioSrc: customAudio || `audio/p${paragraphIndex + 1}.mp3`,
              text: activeParagraph.textContent.trim(),
              slide: currentSlide
            };
          },
          {
            onPlay: payload => mediaSync?.publishAudio({
              playing: true,
              audioSrc: new URL(payload.audioSrc, location.href).href,
              slide: payload.slide
            }),
            onStop: () => mediaSync?.publishAudio({ playing: false, slide: currentSlide })
          }
        )
      : () => {};

    function updateParagraphGlossary(paragraph) {
      glossaryList.replaceChildren();
      if (!paragraph) {
        glossaryBox.hidden = true;
        return;
      }
      const tips = Array.from(paragraph.querySelectorAll(".vocab-tip"));
      if (!tips.length) {
        glossaryBox.hidden = true;
        return;
      }
      tips.forEach(tip => {
        const li = document.createElement("li");
        const strong = document.createElement("strong");
        strong.textContent = tip.textContent.trim();
        const explanation = tip.getAttribute("data-glossary") || tip.getAttribute("data-tip") || "";
        li.append(strong, ` — ${explanation}`);
        glossaryList.appendChild(li);
      });
      glossaryBox.hidden = false;
    }

    stepsNav.replaceChildren();
    for (let i = 0; i < totalSlides; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reading-step";
      if (hasVideo && i === 0) {
        btn.textContent = "🎬";
        btn.setAttribute("aria-label", "Vai al video introduttivo");
      } else {
        const num = hasVideo ? i : i + 1;
        btn.textContent = String(num);
        btn.setAttribute("aria-label", `Vai al paragrafo ${num}`);
      }
      btn.addEventListener("click", () => showSlide(i));
      stepsNav.appendChild(btn);
    }

    function showSlide(index, { fromRemote = false } = {}) {
      stopSpeech(true);
      currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
      const showingVideo = hasVideo && currentSlide === 0;
            const paragraphIndex = hasVideo ? currentSlide - 1 : currentSlide;

      window.ParloNotesScope = {
        group: session.safeGroup || "sconosciuto",
        exercise: pageKey,
        card: showingVideo ? "video" : `paragrafo_${paragraphIndex + 1}`,
        cardLabel: showingVideo ? "Video introduttivo" : `Paragrafo ${paragraphIndex + 1}`
      };
      window.dispatchEvent(new CustomEvent("parlo:notes-scope-changed", {
        detail: window.ParloNotesScope
      }));

      if (videoCard && hasVideo) videoCard.hidden = !showingVideo;
      readingCard.hidden = showingVideo;

      storyParagraphs.forEach((paragraph, idx) => {
        paragraph.hidden = idx !== paragraphIndex;
      });

      updateParagraphGlossary(showingVideo ? null : storyParagraphs[paragraphIndex]);

      stepsNav.querySelectorAll("button").forEach((btn, idx) => {
        btn.setAttribute("aria-current", idx === currentSlide ? "step" : "false");
      });

      previousParagraphButton.disabled = currentSlide === 0;
      const isLastParagraph = currentSlide === totalSlides - 1;
      nextParagraphButton.hidden = isLastParagraph;
      nextParagraphButton.disabled = isLastParagraph;
      if (exerciseALink) exerciseALink.hidden = !isLastParagraph;

      readingProgress.textContent = showingVideo
        ? "Video introduttivo"
        : `Paragrafo ${paragraphIndex + 1} di ${storyParagraphs.length}`;

      if (!fromRemote) {
        mediaSync?.publishSlide(currentSlide);
      }
    }

    previousParagraphButton.addEventListener("click", () => showSlide(currentSlide - 1));
    nextParagraphButton.addEventListener("click", () => showSlide(currentSlide + 1));
    showSlide(0, { fromRemote: true });

    document.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target.closest("input, textarea, select, a, button, [tabindex]")) return;

      if (event.key === "ArrowLeft" && currentSlide > 0) {
        event.preventDefault();
        showSlide(currentSlide - 1);
      } else if (event.key === "ArrowRight" && currentSlide < totalSlides - 1) {
        event.preventDefault();
        showSlide(currentSlide + 1);
      }
    });

    if (window.ParloExercise) {
      populateUnitMenus();
      ParloExercise.initBackgroundParallax();
      ParloExercise.decorateSessionLinks();
      const exMenu = document.getElementById("exercise-menu");
      const grMenu = document.getElementById("grammar-menu");
      if (exMenu) ParloExercise.bindNavigationSelect(exMenu);
      if (grMenu) ParloExercise.bindNavigationSelect(grMenu);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReadingPage, { once: true });
  } else {
    initReadingPage();
  }
})();