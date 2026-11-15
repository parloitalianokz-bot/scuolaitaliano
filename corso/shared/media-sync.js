/* Sincronizzazione in tempo reale (slide, audio MP3 e video YouTube) per le lezioni online. */
(() => {
  "use strict";

  function createMediaSync(options = {}) {
    const session = window.ParloSession || {};
    const group = session.group || "sconosciuto";
    const safeGroup = session.safeGroup || "sconosciuto";
    const isTeacher = Boolean(session.isTeacher);
    const pageKey = String(options.pageKey || location.pathname.split("/").pop() || "lettura")
      .replace(/[.#$\/\[\]]/g, "_");

    if (!window.firebase || !group || group === "sconosciuto" || safeGroup === "sconosciuto") {
      return {
        enabled: false,
        publishSlide() {},
        publishAudio() {},
        destroy() {}
      };
    }

    const db = window.ParloModes?.initFirebase
      ? window.ParloModes.initFirebase()
      : (!firebase.apps.length ? firebase.initializeApp({
          authDomain: "esercizi-parlo-italiano.firebaseapp.com",
          databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "esercizi-parlo-italiano"
        }) : null, firebase.database());

    const syncRef = db.ref(`esercizi/gruppi/${safeGroup}/mediaSync/${pageKey}`);
    const senderId = `client_${Math.random().toString(36).slice(2, 10)}`;

    let teacherBroadcast = isTeacher;
    let studentUnlocked = false;
    let remoteAudio = null;
    let ytPlayer = null;
    let ytReady = false;
    let ignoringRemote = false;
    let lastCommandId = null;

    // ─── Banner / Controllo UI ───
    const host = options.bannerHost || document.querySelector("main") || document.body;
    const bar = document.createElement("div");
    Object.assign(bar.style, {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      maxWidth: "820px",
      margin: "0 auto 14px",
      padding: "8px 14px",
      borderRadius: "12px",
      border: "1px solid #d8e5d8",
      background: "rgba(255, 254, 250, 0.94)",
      fontFamily: "'Segoe UI', Inter, system-ui, sans-serif",
      fontSize: ".88rem",
      fontWeight: "700"
    });

    if (isTeacher) {
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      Object.assign(toggleBtn.style, {
        minHeight: "34px",
        padding: "5px 12px",
        borderRadius: "999px",
        border: "1px solid #2f5739",
        background: "#2f5739",
        color: "#fff",
        font: "inherit",
        cursor: "pointer"
      });
      const renderTeacherBtn = () => {
        toggleBtn.textContent = teacherBroadcast
          ? "📡 Sincronizzazione classe: ATTIVA"
          : "📡 Sincronizzazione classe: DISATTIVA";
        toggleBtn.style.background = teacherBroadcast ? "#2f5739" : "#fff";
        toggleBtn.style.color = teacherBroadcast ? "#fff" : "#2f5739";
      };
      renderTeacherBtn();
      toggleBtn.addEventListener("click", () => {
        teacherBroadcast = !teacherBroadcast;
        renderTeacherBtn();
      });
      bar.appendChild(toggleBtn);
    } else {
      const unlockBtn = document.createElement("button");
      unlockBtn.type = "button";
      unlockBtn.textContent = "🔊 Включить синхронный звук";
      Object.assign(unlockBtn.style, {
        minHeight: "36px",
        padding: "6px 14px",
        borderRadius: "999px",
        border: "1px solid #bd694d",
        background: "#fff3ed",
        color: "#bd694d",
        font: "inherit",
        cursor: "pointer"
      });

      const unlockAudioContext = () => {
        if (studentUnlocked) return;
        studentUnlocked = true;
        // Sblocca sia Web Audio / HTMLAudio sia eventuale player YouTube
        try {
          const silent = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
          silent.play().catch(() => {});
        } catch (_) {}
        if (ytReady && ytPlayer && typeof ytPlayer.unMute === "function") {
          try { ytPlayer.unMute(); } catch (_) {}
        }
        unlockBtn.textContent = "✅ Синхронный звук включён";
        unlockBtn.style.borderColor = "#2f5739";
        unlockBtn.style.background = "#edf4ed";
        unlockBtn.style.color = "#2f5739";
      };

      unlockBtn.addEventListener("click", unlockAudioContext);
      bar.appendChild(unlockBtn);
    }

    if (options.insertBefore) {
      host.insertBefore(bar, options.insertBefore);
    } else {
      host.prepend(bar);
    }

    // ─── Gestione Audio MP3 Remoto (Studenti) ───
    function stopRemoteAudio() {
      if (remoteAudio) {
        remoteAudio.pause();
        remoteAudio.currentTime = 0;
        remoteAudio = null;
      }
    }

    function playRemoteAudio(audioSrc, offsetSec = 0) {
      stopRemoteAudio();
      if (!audioSrc) return;
      const audio = new Audio(audioSrc);
      remoteAudio = audio;
      if (offsetSec > 0.4) {
        audio.addEventListener("loadedmetadata", () => {
          if (Number.isFinite(audio.duration) && offsetSec < audio.duration) {
            audio.currentTime = offsetSec;
          }
        }, { once: true });
      }
      audio.play().catch(() => {
        // Se lo studente non ha ancora cliccato il pulsante russo, evidenzia il banner
        if (!studentUnlocked && bar.firstElementChild) {
          bar.firstElementChild.style.boxShadow = "0 0 0 3px rgba(189, 105, 77, 0.35)";
        }
      });
    }

    // ─── Integrazione YouTube IFrame API ───
    const iframe = options.youtubeIframe || document.querySelector(".video-frame iframe");
    if (iframe && /youtube\.com\/embed\//i.test(iframe.src)) {
      const url = new URL(iframe.src);
      if (!url.searchParams.has("enablejsapi")) {
        url.searchParams.set("enablejsapi", "1");
        url.searchParams.set("origin", location.origin);
        iframe.src = url.toString();
      }
      if (!iframe.id) iframe.id = "parlo-yt-player";

      const initYouTube = () => {
        if (!window.YT || !window.YT.Player) return;
        ytPlayer = new window.YT.Player(iframe.id, {
          events: {
            onReady: () => { ytReady = true; },
            onStateChange: event => {
              if (!isTeacher || !teacherBroadcast || ignoringRemote) return;
              const state = event.data;
              if (state === window.YT.PlayerState.PLAYING || state === window.YT.PlayerState.PAUSED) {
                const currentTime = typeof ytPlayer.getCurrentTime === "function" ? ytPlayer.getCurrentTime() : 0;
                writeCommand({
                  type: "youtube",
                  state: state === window.YT.PlayerState.PLAYING ? "play" : "pause",
                  time: Number(currentTime.toFixed(2))
                });
              }
            }
          }
        });
      };

      if (window.YT && window.YT.Player) {
        initYouTube();
      } else {
        const prevReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (typeof prevReady === "function") prevReady();
          initYouTube();
        };
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          document.head.appendChild(tag);
        }
      }
    }

    // ─── Scrittura e Lettura Comandi Firebase ───
    function writeCommand(payload) {
      if (!isTeacher || !teacherBroadcast) return;
      const commandId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      lastCommandId = commandId;
      syncRef.set({
        ...payload,
        commandId,
        senderId,
        updatedAt: Date.now()
      }).catch(() => {});
    }

    const onRemoteUpdate = snapshot => {
      const cmd = snapshot.val();
      if (!cmd || cmd.senderId === senderId || cmd.commandId === lastCommandId) return;
      // Ignora comandi vecchi di oltre 2 ore (es. lezioni passate)
      if (cmd.updatedAt && Date.now() - cmd.updatedAt > 2 * 60 * 60 * 1000) return;
      lastCommandId = cmd.commandId;

      if (isTeacher) return;

      if (typeof cmd.slide === "number" && typeof options.onRemoteSlide === "function") {
        ignoringRemote = true;
        options.onRemoteSlide(cmd.slide);
        ignoringRemote = false;
      }

      if (cmd.type === "audio") {
        if (cmd.playing) {
          const elapsed = cmd.updatedAt ? Math.max(0, (Date.now() - cmd.updatedAt) / 1000) : 0;
          playRemoteAudio(cmd.audioSrc, elapsed);
        } else {
          stopRemoteAudio();
        }
      } else if (cmd.type === "youtube" && ytReady && ytPlayer) {
        ignoringRemote = true;
        try {
          if (typeof cmd.time === "number" && typeof ytPlayer.seekTo === "function") {
            ytPlayer.seekTo(cmd.time, true);
          }
          if (cmd.state === "play" && typeof ytPlayer.playVideo === "function") {
            if (!studentUnlocked && typeof ytPlayer.mute === "function") {
              ytPlayer.mute();
            }
            ytPlayer.playVideo();
          } else if (cmd.state === "pause" && typeof ytPlayer.pauseVideo === "function") {
            ytPlayer.pauseVideo();
          }
        } catch (_) {}
        setTimeout(() => { ignoringRemote = false; }, 350);
      }
    };

    syncRef.on("value", onRemoteUpdate);

    return {
      enabled: true,
      publishSlide(slideIndex) {
        stopRemoteAudio();
        writeCommand({ type: "slide", slide: slideIndex });
      },
      publishAudio({ playing, audioSrc, slide }) {
        writeCommand({
          type: "audio",
          playing: Boolean(playing),
          audioSrc: audioSrc || "",
          slide: typeof slide === "number" ? slide : null
        });
      },
      destroy() {
        stopRemoteAudio();
        syncRef.off("value", onRemoteUpdate);
      }
    };
  }

  window.ParloMediaSync = Object.freeze({ createMediaSync });
})();