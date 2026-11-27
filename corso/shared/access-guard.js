(() => {
  "use strict";

  const parts = window.location.pathname.split("/").filter(Boolean);
  const unitIndex = parts.findIndex(part => /^u_\d{3}$/i.test(part));
  if (unitIndex < 0) return;

  const unitNumber = Number(parts[unitIndex].slice(2));
  document.documentElement.style.visibility = "hidden";

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("parlo_session") || "null");
  } catch (_) {}

  const hasSession = session?.loginVerified === true && Boolean(session.group) && (
    (session.isTeacher === true && Boolean(session.teacher)) ||
    (session.isTeacher === false && Boolean(session.name))
  );

  const redirectHome = () => {
    const base = parts.slice(0, unitIndex);
    const home = `/${base.length ? `${base.join("/")}/` : ""}index.html`;
    window.location.replace(home);
  };

  if (!hasSession) {
    redirectHome();
    return;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyBbOOnXPeSgqV_oT7uXdAEioU4Ha9nkbSY",
    authDomain: "esercizi-parlo-italiano.firebaseapp.com",
    databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esercizi-parlo-italiano",
    appId: "1:499443551452:web:0e05cb85de9f9ade897819"
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function ensureFirebase() {
    if (!window.firebase) {
      await loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
    }
    if (!window.firebase?.database) {
      await loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js");
    }
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    return firebase.database();
  }

  function entries(value) {
    return Array.isArray(value) ? value : Object.values(value || {});
  }

  async function verifyUnitAccess() {
    const groupId = String(session.group).trim().replace(/[.#$\/\[\]]/g, "_");
    if (!groupId || groupId === "sconosciuto" || !Number.isInteger(unitNumber)) return false;

    const database = await ensureFirebase();
    const snapshot = await database.ref(`configurazioneScuola/gruppi/${groupId}`).once("value");
    const group = snapshot.val();
    if (!group) return false;

    let allowedThrough;
    if (session.isTeacher === true) {
      allowedThrough = Number(group.unitNumber ?? 1);
    } else {
      const studentName = String(session.name || "").trim();
      const activeStudent = entries(group.studenti).find(student => student?.nome === studentName);
      const inactiveStudent = entries(group.studentiInattivi).find(student => student?.nome === studentName);
      if (!activeStudent && !inactiveStudent) return false;

      allowedThrough = inactiveStudent
        ? Number(inactiveStudent.unitNumber ?? group.unitNumber ?? 1)
        : Number(group.unitNumber ?? 1);
    }

    return Number.isFinite(allowedThrough) && allowedThrough >= unitNumber;
  }

  verifyUnitAccess()
    .then(allowed => {
      if (!allowed) {
        redirectHome();
        return;
      }
      document.documentElement.style.removeProperty("visibility");
    })
    .catch(redirectHome);
})();
