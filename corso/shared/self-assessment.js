/* Motore riutilizzabile per schede di autovalutazione bilingui. */
(() => {
  "use strict";

  const config = window.PARLO_SELF_ASSESSMENT;
  if (!config || !Array.isArray(config.objectives) || !Array.isArray(config.choices)) return;

  const selections = Array(config.objectives.length).fill(null);
  const form = document.getElementById("assessment-form");
  const goalList = document.getElementById("goal-list");
  const submitButton = document.getElementById("submit-assessment");
  const statusBox = document.getElementById("assessment-status");
  const resultsBox = document.getElementById("assessment-results");
  let firebaseDb = null;
  try { firebaseDb = window.ParloModes?.initFirebase?.() || null; } catch (_) {}
  const statisticRef = firebaseDb && config.statsPath ? firebaseDb.ref(config.statsPath) : null;

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (_) { return false; }
  }
  function setStatus(message) {
    statusBox.textContent = message;
    statusBox.hidden = !message;
  }

  config.objectives.forEach((objective, index) => {
    const item = document.createElement("section");
    item.className = "goal-item";
    item.setAttribute("aria-labelledby", `goal-title-${index}`);
    const title = document.createElement("p");
    title.className = "goal-title";
    title.id = `goal-title-${index}`;
    title.append(document.createTextNode(objective.it));
    const translation = document.createElement("span");
    translation.className = "goal-translation";
    translation.lang = "ru";
    translation.textContent = objective.ru;
    title.appendChild(translation);

    const options = document.createElement("div");
    options.className = "mood-options";
    options.setAttribute("role", "group");
    options.setAttribute("aria-label", `Autovalutazione: ${objective.it}`);
    config.choices.forEach(choice => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mood-button";
      button.dataset.objective = String(index);
      button.dataset.choice = choice.key;
      button.setAttribute("aria-pressed", "false");
      const accessibleLabel = `${choice.emoji} ${choice.it} / ${choice.ru}`;
      button.setAttribute("aria-label", accessibleLabel);
      button.title = accessibleLabel;
      const emoji = document.createElement("span");
      emoji.className = "mood-emoji";
      emoji.setAttribute("aria-hidden", "true");
      emoji.textContent = choice.emoji;
      const label = document.createElement("span");
      label.className = "choice-label";
      label.append(document.createTextNode(choice.it));
      const labelRu = document.createElement("span");
      labelRu.lang = "ru";
      labelRu.textContent = choice.ru;
      label.appendChild(labelRu);
      button.append(emoji, label);
      button.addEventListener("click", () => {
        selections[index] = choice.key;
        options.querySelectorAll(".mood-button").forEach(option => {
          option.setAttribute("aria-pressed", String(option === button));
        });
        submitButton.disabled = selections.some(value => !value);
      });
      options.appendChild(button);
    });

    const stats = document.createElement("p");
    stats.className = "goal-stats";
    stats.id = `goal-stats-${index}`;
    stats.setAttribute("aria-live", "polite");
    item.append(title, options, stats);
    goalList.appendChild(item);
  });

  function getLocalStats() {
    try {
      const parsed = JSON.parse(safeStorageGet(config.localStatsKey) || "null");
      return Array.isArray(parsed)
        ? parsed
        : config.objectives.map(() => Object.fromEntries(config.choices.map(choice => [choice.key, 0])));
    } catch (_) {
      return config.objectives.map(() => Object.fromEntries(config.choices.map(choice => [choice.key, 0])));
    }
  }

  function renderStats(data) {
    config.objectives.forEach((_, index) => {
      const counts = data?.[`obiettivo_${index + 1}`] || {};
      const values = config.choices.map(choice => Math.max(0, Number(counts[choice.key]) || 0));
      const total = values.reduce((sum, value) => sum + value, 0);
      const percentages = values.map(value => total ? Math.round(value * 100 / total) : 0);
      const line = document.getElementById(`goal-stats-${index}`);
      line.textContent = `${config.choices.map((choice, choiceIndex) => `${choice.emoji} ${percentages[choiceIndex]}%`).join(" | ")} · Totale: ${total} partecipanti / Всего: ${total}`;
      line.classList.add("is-visible");
    });
  }

  async function loadStats() {
    if (!statisticRef) {
      const local = getLocalStats();
      renderStats(Object.fromEntries(local.map((counts, index) => [`obiettivo_${index + 1}`, counts])));
      return;
    }
    try {
      const snapshot = await statisticRef.once("value");
      renderStats(snapshot.val() || {});
    } catch (_) {
      setStatus("Non è stato possibile leggere le statistiche online. / Не удалось загрузить статистику.");
      renderStats({});
    }
  }

  function showFeedback(answers, previouslySubmitted = false) {
    form.querySelectorAll(".mood-options").forEach(options => { options.hidden = true; });
    submitButton.hidden = true;
    resultsBox.hidden = false;
    if (previouslySubmitted || !answers) {
      document.getElementById("feedback-it").textContent = "Grazie per aver completato il bilancio! Ogni passo, anche piccolo, fa parte del tuo apprendimento: scegli un obiettivo da riprendere e continua con fiducia.";
      document.getElementById("feedback-ru").textContent = "Спасибо, что заполнил(а) анкету! Каждый шаг, даже маленький, помогает учиться: выбери одну цель для повторения и продолжай уверенно.";
      return;
    }
    const thinking = answers.filter(answer => answer === "thinking").length;
    const neutral = answers.filter(answer => answer === "neutral").length;
    if (thinking >= 2) {
      document.getElementById("feedback-it").textContent = "Hai già fatto un bel percorso. È normale avere ancora qualche dubbio: ripassa con calma gli obiettivi che hai indicato e vedrai che diventeranno più familiari.";
      document.getElementById("feedback-ru").textContent = "Ты уже проделал(а) большой путь. Сомневаться — это нормально: спокойно повтори выбранные темы, и они станут понятнее.";
    } else if (neutral >= 2) {
      document.getElementById("feedback-it").textContent = "Hai costruito una buona base. Un breve ripasso ti aiuterà a sentirti più sicuro/a: stai imparando passo dopo passo.";
      document.getElementById("feedback-ru").textContent = "У тебя уже есть хорошая основа. Небольшое повторение поможет почувствовать себя увереннее: ты учишься шаг за шагом.";
    } else if (answers.every(answer => answer === "happy")) {
      document.getElementById("feedback-it").textContent = "Ottimo lavoro: riconosci i progressi che hai fatto! Continua a usare l’italiano in situazioni nuove: imparare è un percorso che continua.";
      document.getElementById("feedback-ru").textContent = "Отличная работа: ты замечаешь свой прогресс! Продолжай использовать итальянский в новых ситуациях — обучение продолжается.";
    } else {
      document.getElementById("feedback-it").textContent = "Hai già raggiunto alcuni obiettivi e sai su cosa concentrarti. Continua così: con un po’ di pratica i prossimi passi arriveranno.";
      document.getElementById("feedback-ru").textContent = "Ты уже достиг(ла) некоторых целей и знаешь, над чем поработать. Продолжай: практика поможет сделать следующие шаги.";
    }
  }

  async function incrementFirebase(answers) {
    const updates = {};
    answers.forEach((answer, index) => {
      updates[`obiettivo_${index + 1}/${answer}`] = firebase.database.ServerValue.increment(1);
    });
    await statisticRef.update(updates);
  }

  function incrementLocal(answers) {
    const stats = getLocalStats();
    answers.forEach((answer, index) => {
      if (!stats[index] || typeof stats[index] !== "object") stats[index] = {};
      stats[index][answer] = (Number(stats[index][answer]) || 0) + 1;
    });
    safeStorageSet(config.localStatsKey, JSON.stringify(stats));
  }

  submitButton.addEventListener("click", async () => {
    if (selections.some(value => !value)) return;
    if (safeStorageGet(config.voteKey)) {
      showFeedback(null, true);
      await loadStats();
      return;
    }
    submitButton.disabled = true;
    setStatus("");
    const answers = [...selections];
    try {
      if (statisticRef) await incrementFirebase(answers);
      else incrementLocal(answers);
      safeStorageSet(config.voteKey, "submitted");
      showFeedback(answers);
      await loadStats();
    } catch (_) {
      submitButton.disabled = false;
      setStatus("Il risultato non è stato inviato. Riprova tra poco. / Не удалось отправить результат. Попробуй ещё раз.");
    }
  });

  if (safeStorageGet(config.voteKey)) {
    showFeedback(null, true);
    loadStats();
  }
})();
