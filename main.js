import { services, reviews } from './content.js';
import { initCarousel } from './carousel.js';
import { initHeroVideo } from './hero-video.js';

const grid = document.querySelector('#services-grid');
const dialog = document.querySelector('#service-dialog');

services.forEach((service, index) => {
  const button = document.createElement('button');
  button.className = 'service-card';
  button.innerHTML = `
    <span class="service-top"><span>0${index + 1}</span><span class="service-icon">${service.icon}</span></span>
    <h3>${service.title}</h3>
    <p>${service.summary}</p>
    <span class="service-more">Conocer servicio</span>
  `;
  button.addEventListener('click', () => {
    document.querySelector('#dialog-title').textContent = service.title;
    document.querySelector('#dialog-copy').textContent = service.detail;
    dialog.showModal();
  });
  grid.append(button);
});

reviews.forEach(review => {
  const article = document.createElement('article');
  article.className = 'review-card';
  article.innerHTML = `<div class="review-top"><span class="avatar">${review.initials}</span><div><h3>${review.name}</h3><small>Opinión en Google${review.excerpt ? ' · Extracto' : ''}</small></div><span class="google-mark">G</span></div><div class="stars" aria-label="5 de 5 estrellas">★★★★★</div><blockquote>“${review.text}”</blockquote><a href="https://maps.app.goo.gl/7fvVwD27GrBo7NGT7" target="_blank" rel="noopener">Ver en Google</a>`;
  document.querySelector('#reviews-track').append(article);
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.querySelector('a').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('is-open', expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));

const links = [...nav.querySelectorAll('a')];
const indicator = nav.querySelector('.nav-indicator');
let activeLink = links[0];

function moveIndicator(link, hovering = false) {
  if (!link || !link.offsetWidth) return;
  indicator.style.width = link.offsetWidth + 'px';
  indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
  indicator.classList.toggle('is-hovered', hovering);
}
links.forEach(link => {
  link.addEventListener('pointerenter', () => moveIndicator(link, true));
  link.addEventListener('focus', () => moveIndicator(link, true));
  link.addEventListener('click', () => {
    activeLink = link;
    moveIndicator(link);
  });
});
nav.addEventListener('pointerleave', () => moveIndicator(activeLink));
nav.addEventListener('focusout', () => moveIndicator(activeLink));
window.addEventListener('resize', () => moveIndicator(activeLink));
new ResizeObserver(() => moveIndicator(activeLink)).observe(nav);
const sectionObserver = new IntersectionObserver(entries => {
  const entry = entries.find(item => item.isIntersecting);
  if (!entry) return;
  links.forEach(link => {
    const active = link.hash === '#' + entry.target.id;
    link.classList.toggle('active', active);
    if (active) {
      activeLink = link;
      link.setAttribute('aria-current', 'location');
    } else link.removeAttribute('aria-current');
  });
  moveIndicator(activeLink);
}, { rootMargin: '-20% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
moveIndicator(activeLink);
document.querySelector('#year').textContent = new Date().getFullYear();

initCarousel();
initHeroVideo();

// La cabecera permanece visible y se oscurece al terminar el hero.
const header = document.querySelector('.site-header');
const hero = document.querySelector('#inicio');
function updateHeaderBackground() {
  const leavingHero = hero.getBoundingClientRect().bottom <= header.offsetHeight;
  header.classList.toggle('is-solid', leavingHero);
}
window.addEventListener('scroll', updateHeaderBackground, { passive: true });
window.addEventListener('resize', updateHeaderBackground);
updateHeaderBackground();
