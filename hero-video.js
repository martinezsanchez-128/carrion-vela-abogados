// Recuperación de reproducción tras suspensión, cambio de pestaña o bloqueo.
export function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  const toggle = document.querySelector('#video-toggle');
  let userPaused = false;
  let recovering = false;
  let lastTime = -1;
  let stagnantChecks = 0;

  function updateControl() {
    toggle.textContent = userPaused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', userPaused ? 'Reproducir video de fondo' : 'Pausar video de fondo');
  }

  async function resume(reload = false) {
    if (userPaused || recovering) return;
    recovering = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    if (reload || video.error) video.load();
    try {
      await video.play();
    } catch {
      // El póster de fondo permanece visible si el navegador suspende el video.
    } finally {
      recovering = false;
    }
  }

  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    if (userPaused) video.pause();
    else resume();
    updateControl();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      stagnantChecks = 0;
      resume();
    }
  });
  window.addEventListener('pageshow', () => resume());
  window.addEventListener('focus', () => resume());
  video.addEventListener('canplay', () => resume());
  video.addEventListener('pause', () => {
    if (!userPaused && !document.hidden) resume();
  });
  video.addEventListener('ended', () => {
    if (!userPaused) {
      video.currentTime = 0;
      resume();
    }
  });

  // Recuperar decodificación detenida; nunca recargar un video que avanza.
  setInterval(() => {
    if (userPaused || document.hidden) return;
    const advancing = Math.abs(video.currentTime - lastTime) > 0.05;
    stagnantChecks = advancing ? 0 : stagnantChecks + 1;
    lastTime = video.currentTime;
    if (stagnantChecks >= 3) {
      stagnantChecks = 0;
      resume(true);
    } else if (video.paused || video.ended || video.error) resume();
  }, 2500);

  updateControl();
  resume();
}
