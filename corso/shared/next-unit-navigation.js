/* Controllo permessi e avanzamento condiviso verso l'unità successiva. */
(() => {
  "use strict";

  const widget = document.getElementById("next-unit-navigation");
  if (!widget) return;
  const currentUnit = Number(widget.dataset.currentUnit);
  const nextUnit = Number(widget.dataset.nextUnit);
  const target = widget.dataset.href;
  const link = widget.querySelector(".next-unit-link");
  const enableButton = widget.querySelector(".next-unit-enable");
  const status = widget.querySelector(".next-unit-status");
  let session = window.ParloSession || {};
  let storedSession = {};
  try { storedSession = JSON.parse(localStorage.getItem("parlo_session") || "{}"); } catch (_) {}
  const isTeacher = storedSession.loginVerified === true && storedSession.isTeacher === true && Boolean(storedSession.teacher);
  const groupKey = String(session.safeGroup || session.group || "").trim().replace(/[.#$\/[\]]/g, "_");

  function setStatus(it, ru = "") {
    status.textContent = ru ? `${it} / ${ru}` : it;
  }
  function setLinkEnabled(enabled) {
    if (enabled) {
      link.href = target;
      link.setAttribute("aria-disabled", "false");
      link.removeAttribute("tabindex");
    } else {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
    }
  }

  setLinkEnabled(false);
  enableButton.hidden = true;
  if (!Number.isInteger(currentUnit) || !Number.isInteger(nextUnit) || nextUnit !== currentUnit + 1 || !target || !groupKey || groupKey === "sconosciuto") {
    setStatus("Non è stato possibile verificare l’accesso all’unità successiva.", "Не удалось проверить доступ к следующему разделу.");
    return;
  }

  let database;
  try { database = window.ParloModes?.initFirebase?.(); } catch (_) {}
  if (!database) {
    setStatus("Accesso all’unità successiva non verificabile in questo momento.", "Сейчас не удалось проверить доступ к следующему разделу.");
    return;
  }

  const groupRef = database.ref(`configurazioneScuola/gruppi/${groupKey}`);
  groupRef.on("value", snapshot => {
    const group = snapshot.val();
    if (!group) {
      setLinkEnabled(false);
      enableButton.hidden = true;
      setStatus("Gruppo non trovato: chiedi all’insegnante di verificare l’accesso.", "Группа не найдена: попроси преподавателя проверить доступ.");
      return;
    }
    const allowedThrough = Number(group.unitNumber ?? 1);
    const allowed = Number.isFinite(allowedThrough) && allowedThrough >= nextUnit;
    setLinkEnabled(allowed);
    enableButton.hidden = !isTeacher || allowedThrough > currentUnit;
    enableButton.disabled = !isTeacher || allowedThrough > currentUnit;
    if (allowed) {
      setStatus(`Puoi proseguire all’Unità ${nextUnit}.`, `Доступен переход к разделу ${nextUnit}.`);
    } else if (isTeacher && allowedThrough <= currentUnit) {
      setStatus(`Il gruppo è abilitato fino all’Unità ${allowedThrough}: puoi sbloccare l’Unità ${nextUnit}.`, `Группе открыт доступ до раздела ${allowedThrough}: ты можешь открыть раздел ${nextUnit}.`);
    } else {
      setStatus(`L’Unità ${nextUnit} non è ancora abilitata per il gruppo.`, `Раздел ${nextUnit} пока не открыт для группы.`);
    }
  }, () => {
    setLinkEnabled(false);
    enableButton.hidden = true;
    setStatus("Errore nella verifica dei permessi del gruppo.", "Не удалось проверить разрешения группы.");
  });

  enableButton.addEventListener("click", async () => {
    if (!isTeacher || enableButton.disabled) return;
    enableButton.disabled = true;
    setStatus("Aggiornamento dell’accesso…", "Обновление доступа…");
    try {
      const result = await groupRef.child("unitNumber").transaction(value => {
        const current = Number(value ?? 1);
        return Number.isFinite(current) && current <= currentUnit ? nextUnit : undefined;
      });
      if (!result.committed) return;
      const exerciseGroup = groupKey;
      await database.ref(`esercizi/gruppi/${exerciseGroup}/unitNumber`).set(nextUnit);
      setStatus(`Accesso all’Unità ${nextUnit} abilitato per il gruppo.`, `Доступ к разделу ${nextUnit} открыт для группы.`);
    } catch (_) {
      enableButton.disabled = false;
      setStatus("Non è stato possibile aggiornare l’accesso. Riprova o usa il pannello insegnante.", "Не удалось обновить доступ. Попробуй ещё раз или воспользуйся панелью преподавателя.");
    }
  });
})();
