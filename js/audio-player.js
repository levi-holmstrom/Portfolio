/**
 * Custom audio players: play / pause / stop, draggable seek bar.
 * Only one track plays at a time across the page.
 */
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function initAudioPlayers() {
  const players = document.querySelectorAll(".audio-player");

  players.forEach((root) => {
    const audio = root.querySelector("audio");
    if (!audio) return;

    const frame = root.closest("[data-media]");
    const playBtn = root.querySelector('[data-action="play"]');
    const stopBtn = root.querySelector('[data-action="stop"]');
    const seek = root.querySelector(".audio-player__seek");
    const currentEl = root.querySelector(".audio-player__time--current");
    const durationEl = root.querySelector(".audio-player__time--duration");
    const playIcon = root.querySelector(".icon-play");
    const pauseIcon = root.querySelector(".icon-pause");

    let seeking = false;

    const setPlayingUi = (playing) => {
      root.classList.toggle("is-playing", playing);
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
      if (playIcon) playIcon.hidden = playing;
      if (pauseIcon) pauseIcon.hidden = !playing;
    };

    const updateTimes = () => {
      const dur = audio.duration;
      const cur = audio.currentTime;
      if (durationEl && Number.isFinite(dur)) {
        durationEl.textContent = formatTime(dur);
      }
      if (currentEl) currentEl.textContent = formatTime(cur);
      if (seek && Number.isFinite(dur) && dur > 0 && !seeking) {
        seek.value = String((cur / dur) * 100);
      }
    };

    const pauseOthers = () => {
      players.forEach((other) => {
        if (other === root) return;
        const otherAudio = other.querySelector("audio");
        if (!otherAudio) return;
        otherAudio.pause();
        other.classList.remove("is-playing");
        const oPlay = other.querySelector(".icon-play");
        const oPause = other.querySelector(".icon-pause");
        if (oPlay) oPlay.hidden = false;
        if (oPause) oPause.hidden = true;
        other.querySelector('[data-action="play"]')?.setAttribute("aria-label", "Play");
      });
    };

    playBtn?.addEventListener("click", () => {
      if (frame?.classList.contains("is-placeholder")) return;
      if (audio.paused) {
        pauseOthers();
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    stopBtn?.addEventListener("click", () => {
      if (frame?.classList.contains("is-placeholder")) return;
      audio.pause();
      audio.currentTime = 0;
      updateTimes();
      setPlayingUi(false);
    });

    seek?.addEventListener("input", () => {
      seeking = true;
      const dur = audio.duration;
      if (Number.isFinite(dur) && dur > 0) {
        const pct = Number(seek.value) / 100;
        audio.currentTime = pct * dur;
        if (currentEl) currentEl.textContent = formatTime(audio.currentTime);
      }
    });

    seek?.addEventListener("change", () => {
      seeking = false;
    });

    audio.addEventListener("loadedmetadata", updateTimes);
    audio.addEventListener("durationchange", updateTimes);
    audio.addEventListener("timeupdate", updateTimes);
    audio.addEventListener("play", () => {
      pauseOthers();
      setPlayingUi(true);
    });
    audio.addEventListener("pause", () => setPlayingUi(false));
    audio.addEventListener("ended", () => {
      setPlayingUi(false);
      if (seek) seek.value = "0";
      updateTimes();
    });

    audio.addEventListener("error", () => {
      if (frame) frame.classList.add("is-placeholder");
      root.classList.add("is-disabled");
    });

    audio.addEventListener("canplay", () => {
      if (frame) frame.classList.remove("is-placeholder");
      root.classList.remove("is-disabled");
      updateTimes();
    });

    if (audio.readyState >= 1) updateTimes();
  });
}

document.addEventListener("DOMContentLoaded", initAudioPlayers);
