// Desplazamiento continuo con controles manuales y ciclo sin saltos.
export function initCarousel() {
  const track = document.querySelector('#reviews-track');
  const pause = document.querySelector('#reviews-pause');
  const group = document.createElement('div');
  group.className = 'reviews-group';
  while (track.firstChild) group.append(track.firstChild);
  track.append(group);
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  track.append(copy);

  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let focused = false;
  let offset = 0;
  let target = null;
  let lastFrame = 0;
  const speed = 30;

  function sync() {
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? 'Reanudar recomendaciones' : 'Pausar recomendaciones');
    pause.setAttribute('aria-pressed', String(paused));
  }

  function move(direction) {
    const card = group.querySelector('.review-card');
    target = offset + direction * (card.getBoundingClientRect().width + 24);
  }

  function animate(time) {
    const delta = lastFrame ? Math.min((time - lastFrame) / 1000, .05) : 0;
    lastFrame = time;
    const width = group.getBoundingClientRect().width;
    if (target !== null) {
      const difference = target - offset;
      offset += difference * Math.min(1, delta * 12);
      if (Math.abs(difference) < .5) { offset = target; target = null; }
    } else if (!paused && !focused) offset += speed * delta;
    if (width > 0) {
      // Normalizar también el destino para conservar el sentido del clic.
      if (offset >= width) { offset -= width; if (target !== null) target -= width; }
      if (offset < 0) { offset += width; if (target !== null) target += width; }
    }
    track.style.transform = `translateX(${-offset}px)`;
    requestAnimationFrame(animate);
  }

  document.querySelector('#reviews-prev').addEventListener('click', () => move(-1));
  document.querySelector('#reviews-next').addEventListener('click', () => move(1));
  pause.addEventListener('click', () => { paused = !paused; sync(); });
  track.addEventListener('focusin', () => focused = true);
  track.addEventListener('focusout', () => focused = false);
  sync();
  requestAnimationFrame(animate);
}

