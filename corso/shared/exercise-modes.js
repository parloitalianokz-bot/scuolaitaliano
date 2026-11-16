/* Motore di sincronizzazione Firebase e gestione turni (single-turn, multi-turn, individual). */
(() => {
  "use strict";

  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "INSERISCI_API_KEY",
    authDomain: "esercizi-parlo-italiano.firebaseapp.com",
    databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esercizi-parlo-italiano",
    appId: "INSERISCI_APP_ID"
  };

  const MODES = new Set(["single-turn", "multi-turn", "individual"]);
  const SAFE_KEY = value => String(value ?? "").trim().replace(/[.#$\/\[\]]/g, "_");

  function initFirebase(config = DEFAULT_FIREBASE_CONFIG) {
    if (!window.firebase) return null;
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    return firebase.database();
  }

  function loadGroupRoster(database, safeGroup, minUnitNumber = 0, onUpdate) {
    if (!database || !safeGroup || safeGroup === "sconosciuto") return () => {};
    const groupRef = database.ref(`configurazioneScuola/gruppi/${safeGroup}`);
    const handler = snapshot => {
      const data = snapshot.val() || {};
      const active = Object.values(data.studenti || {}).filter(s => s?.nome);
      const inactive = Object.values(data.studentiInattivi || {}).filter(
        s => s?.nome && Number(s.unitNumber ?? data.unitNumber ?? 0) >= Number(minUnitNumber || 0)
      );
      const roster = [...new Map([...active, ...inactive].map(s => [s.nome, s])).values()]
        .sort((a, b) => String(a.nome).localeCompare(String(b.nome), "it"));
      onUpdate?.(roster, data);
    };
    groupRef.on("value", handler);
    return () => groupRef.off("value", handler);
  }

  function cleanPath(path) {
    const parts = Array.isArray(path) ? path : String(path || "").split("/");
    const clean = parts.map(part => String(part)).filter(Boolean);
    if (clean.some(part => part === "." || part === "..")) {
      throw new Error("Il percorso Firebase contiene un segmento non valido.");
    }
    return clean;
  }

  function pathRef(ref, path) {
    return cleanPath(path).reduce((current, segment) => current.child(segment), ref);
  }

  function parseAssignment(value) {
    if (typeof value === "string" && value) {
      try { value = JSON.parse(value); } catch (_) { value = { role: "student", name: value }; }
    }
    if (!value || !["student", "teacher"].includes(value.role) || !value.name) return null;
    return { role: value.role, name: String(value.name) };
  }

  function sameIdentity(left, right) {
    return Boolean(left && right && left.role === right.role && left.name === right.name);
  }

  function assignmentValue(person) {
    return person ? JSON.stringify({ role: person.role, name: person.name }) : "";
  }

  function createSync(options = {}) {
    const mode = options.mode || "single-turn";
    if (!MODES.has(mode)) throw new Error(`Modalità non supportata: ${mode}`);
    if (!options.ref || typeof options.ref.child !== "function") {
      throw new Error("Passa a createSync un riferimento Firebase Realtime Database.");
    }

    const ref = options.ref;
    const database = options.database || ref.database || (window.firebase?.database ? window.firebase.database() : null);
    const session = options.session || {};
    const isTeacher = Boolean(session.isTeacher);
    const teacherName = String(session.teacherName || session.name || "Insegnante").trim();
    const name = String(isTeacher ? teacherName : (session.name || "")).trim();
    const identity = name ? { role: isTeacher ? "teacher" : "student", name } : null;
    const studentId = SAFE_KEY(session.studentId || name);
    const shareStudentsSummary = options.shareStudentsSummary !== false;
    const uniqueAssignments = Boolean(options.uniqueAssignments);
    const slots = (options.slots || []).map(slot => typeof slot === "string"
      ? { id: slot, label: slot }
      : { ...slot, id: String(slot.id), label: slot.label || slot.id });

    if (mode === "multi-turn" && !slots.length) {
      throw new Error('La modalità "multi-turn" richiede almeno uno slot.');
    }

    const state = { assignments: {}, root: {}, student: {}, students: {} };
    const listeners = [];
    const assignmentMenus = new Set();
    let roster = [];
    let onlineStudents = new Set();
    let closed = false;
    const presenceId = `presence_${Math.random().toString(36).slice(2, 11)}`;

    function assignmentKey(slot) {
      if (mode === "single-turn") return "writer";
      if (mode !== "multi-turn" || !slots.some(item => item.id === slot)) {
        throw new Error(`Slot non configurato: ${slot}`);
      }
      return slot;
    }

    function canWrite(slot) {
      if (!identity || closed) return false;
      if (mode === "individual") return !isTeacher && Boolean(studentId);
      const key = assignmentKey(mode === "single-turn" ? undefined : slot);
      return sameIdentity(identity, state.assignments[key]);
    }

    function valuePath(path, slot) {
      if (mode === "individual") return ["allStudentsData", "students", studentId, ...cleanPath(path)];
      if (mode === "multi-turn") {
        const configured = slots.find(item => item.id === slot);
        if (!configured) throw new Error(`Slot non configurato: ${slot}`);
        const base = configured.dataPath ? cleanPath(configured.dataPath) : ["slots", configured.id];
        return ["tokenData", ...base, ...cleanPath(path)];
      }
      return ["tokenData", ...cleanPath(path)];
    }

    function read(path, slot) {
      const parts = valuePath(path, slot);
      const source = mode === "individual" ? state.student : state.root;
      const relative = mode === "individual" ? parts.slice(3) : parts;
      return relative.reduce((value, key) => value == null ? undefined : value[key], source);
    }

    function emit() {
      if (closed || typeof options.onChange !== "function") return;
      options.onChange({
        mode,
        assignments: { ...state.assignments },
        data: mode === "individual" ? undefined : (state.root.tokenData || {}),
        root: mode === "individual" ? undefined : state.root,
        student: mode === "individual" ? state.student : undefined,
        students: mode === "individual" && (isTeacher || shareStudentsSummary) ? state.students : undefined,
        legacyTokenAnswers: mode === "individual" ? {} : (state.root.tokenData?.answers || {}),
        legacyStudentAnswers: mode === "individual" ? state.students : (state.root.allStudentsData?.students || {}),
        onlineStudents: new Set(onlineStudents)
      });
      assignmentMenus.forEach(renderAssignmentMenu);
    }

    function listen(target, handler) {
      target.on("value", handler, error => options.onError?.(error));
      listeners.push([target, handler]);
    }

    function parseOnlinePresence(presenceTree) {
      const nextOnline = new Set();
      const visit = node => {
        if (!node || typeof node !== "object") return;
        if (node.name && (!node.role || node.role === "student")) {
          nextOnline.add(String(node.name));
        }
        Object.values(node).forEach(child => {
          if (child && typeof child === "object") visit(child);
        });
      };
      visit(presenceTree);
      onlineStudents = nextOnline;
    }

    function registerPresence() {
      if (isTeacher || !name || !studentId || !database || typeof database.ref !== "function") return;
      const presenceRef = ref.child("presence").child(studentId).child(presenceId);
      const connectedRef = database.ref(".info/connected");
      const onConnected = snapshot => {
        if (closed || snapshot.val() !== true) return;
        presenceRef.onDisconnect().remove()
          .then(() => presenceRef.set({
            name,
            role: "student",
            connectedAt: Date.now()
          }))
          .catch(error => options.onError?.(error));
      };
      connectedRef.on("value", onConnected);
      listeners.push([connectedRef, onConnected]);
    }

    function assignmentRef(slot) {
      return ref.child("controlAssignments").child(assignmentKey(slot));
    }

    function setAssignment(slot, target) {
      if (!isTeacher) return Promise.reject(new Error("Solo l’insegnante può assegnare i turni."));
      const key = assignmentKey(slot);
      const person = parseAssignment(target);
      if (uniqueAssignments && mode === "multi-turn" && person && slots.some(item =>
        item.id !== key && sameIdentity(person, state.assignments[item.id]))) {
        return Promise.reject(new Error("Assegna ogni slot a uno studente diverso."));
      }
      return assignmentRef(mode === "single-turn" ? undefined : key).set(person);
    }

    function setMode() {
      if (!isTeacher) return Promise.reject(new Error("Solo l’insegnante può configurare la modalità."));
      return ref.child("controlAssignments").child("mode").set(mode);
    }

    function write(path, value, slot) {
      if (!canWrite(slot)) return Promise.reject(new Error("Non hai i permessi di scrittura per questo campo."));
      return pathRef(ref, valuePath(path, slot)).set(value);
    }

    function remove(path, slot) {
      if (!canWrite(slot)) return Promise.reject(new Error("Non hai i permessi di scrittura per questo campo."));
      return pathRef(ref, valuePath(path, slot)).remove();
    }

    function push(path, value, slot) {
      if (!canWrite(slot)) return Promise.reject(new Error("Non hai i permessi di scrittura per questo campo."));
      return pathRef(ref, valuePath(path, slot)).push().set(value);
    }

    function assignmentFor(slot) {
      return state.assignments[assignmentKey(mode === "single-turn" ? undefined : slot)] || null;
    }

    function assignmentOptions(select, slot) {
      const selected = assignmentValue(assignmentFor(slot));
      const optionsList = [new Option("— Nessuno assegnato —", "")];
      const unique = [...new Map(roster
        .filter(person => person?.name || person?.nome)
        .map(person => {
          const personName = String(person.name || person.nome).trim();
          return [personName, { role: "student", name: personName }];
        })).values()].sort((a, b) => a.name.localeCompare(b.name, "it"));

      const online = unique.filter(person => onlineStudents.has(person.name));
      const offline = unique.filter(person => !onlineStudents.has(person.name));

      if (online.length) {
        const onlineGroup = document.createElement("optgroup");
        onlineGroup.label = "🟢 Studenti online";
        online.forEach(person => {
          onlineGroup.appendChild(new Option(`🟢 ${person.name} · ONLINE`, assignmentValue(person)));
        });
        optionsList.push(onlineGroup);
      }

      if (offline.length) {
        const offlineGroup = document.createElement("optgroup");
        offlineGroup.label = "Studenti offline";
        offline.forEach(person => {
          offlineGroup.appendChild(new Option(person.name, assignmentValue(person)));
        });
        optionsList.push(offlineGroup);
      }

      const current = assignmentFor(slot);
      if (current?.role === "student" && !unique.some(person => sameIdentity(person, current))) {
        const currentGroup = document.createElement("optgroup");
        currentGroup.label = "Turno attuale";
        currentGroup.appendChild(new Option(`${current.name} · non presente nell’elenco`, assignmentValue(current)));
        optionsList.push(currentGroup);
      }

      const teacherGroup = document.createElement("optgroup");
      teacherGroup.label = "👩‍🏫 Insegnante";
      const teacher = { role: "teacher", name: teacherName };
      teacherGroup.appendChild(new Option(`${teacher.name} · insegnante`, assignmentValue(teacher)));
      optionsList.push(teacherGroup);

      select.replaceChildren(...optionsList);
      select.value = selected;
    }

    function renderAssignmentMenu(menu) {
      assignmentOptions(menu.select, menu.slot);
    }

    function bindAssignmentSelect(select, slot, initialRoster = []) {
      if (!isTeacher) {
        select.disabled = true;
        return () => {};
      }
      const menu = { select, slot: mode === "single-turn" ? undefined : slot };
      if (Array.isArray(initialRoster) && initialRoster.length) {
        roster = initialRoster;
      }
      assignmentMenus.add(menu);
      renderAssignmentMenu(menu);
      const onChange = () => {
        let target = null;
        try { target = select.value ? JSON.parse(select.value) : null; } catch (_) {}
        setAssignment(menu.slot, target).catch(error => options.onError?.(error));
      };
      select.addEventListener("change", onChange);
      return () => {
        select.removeEventListener("change", onChange);
        assignmentMenus.delete(menu);
      };
    }

    function setRoster(nextRoster) {
      roster = Array.isArray(nextRoster) ? nextRoster : [];
      assignmentMenus.forEach(renderAssignmentMenu);
    }

    function setOnlineNames(nextOnline) {
      onlineStudents = nextOnline instanceof Set
        ? new Set(nextOnline)
        : new Set(Array.isArray(nextOnline) ? nextOnline.map(String) : []);
      assignmentMenus.forEach(renderAssignmentMenu);
    }

    if (options.trackPresence !== false) {
      registerPresence();
    }

    if (mode === "individual") {
      const assignmentsRef = ref.child("controlAssignments");
      const studentsRef = ref.child("allStudentsData").child("students");
      listen(assignmentsRef, snapshot => {
        state.assignments = snapshot.val() || {};
        emit();
      });
      if (isTeacher || shareStudentsSummary) {
        listen(studentsRef, snapshot => {
          state.students = snapshot.val() || {};
          if (!isTeacher && studentId) {
            state.student = state.students[studentId] || {};
          }
          emit();
        });
      } else if (studentId) {
        listen(studentsRef.child(studentId), snapshot => {
          state.student = snapshot.val() || {};
          emit();
        });
      }
      if (options.trackPresence !== false) {
        listen(ref.child("presence"), snapshot => {
          parseOnlinePresence(snapshot.val() || {});
          emit();
        });
      }
    } else {
      listen(ref, snapshot => {
        state.root = snapshot.val() || {};
        const assignments = state.root.controlAssignments || {};
        state.assignments = {};
        if (mode === "single-turn") {
          state.assignments.writer = parseAssignment(assignments.writer);
        } else {
          slots.forEach(slot => { state.assignments[slot.id] = parseAssignment(assignments[slot.id]); });
        }
        parseOnlinePresence(state.root.presence || {});
        emit();
      });
    }

    return {
      mode,
      identity,
      studentId,
      slots: slots.map(slot => ({ ...slot })),
      canWrite,
      read,
      write,
      remove,
      push,
      setAssignment,
      setMode,
      assignmentFor,
      bindAssignmentSelect,
      setRoster,
      setOnlineNames,
      close() {
        closed = true;
        listeners.forEach(([target, handler]) => target.off("value", handler));
        listeners.length = 0;
        assignmentMenus.clear();
      }
    };
  }

  window.ParloModes = Object.freeze({
    DEFAULT_FIREBASE_CONFIG,
    SAFE_KEY,
    initFirebase,
    loadGroupRoster,
    createSync
  });
})();