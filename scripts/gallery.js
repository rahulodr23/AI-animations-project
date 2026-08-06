import { animations } from './registry.js';

const BADGE_CLASS = { css: 'badge-css', gsap: 'badge-gsap', lottie: 'badge-lottie' };

let currentAnim = null;

function createCard(anim) {
  const card = document.createElement('article');
  card.className = 'anim-card';
  card.dataset.id = anim.id;

  card.innerHTML = `
    <div class="anim-card-preview">
      <iframe src="${anim.folder}/index.html" loading="lazy" title="${anim.name}"></iframe>
    </div>
    <div class="anim-card-body">
      <span class="anim-card-badge ${BADGE_CLASS[anim.type]}">${anim.type}</span>
      <h3 class="anim-card-name">${anim.name}</h3>
      <p class="anim-card-desc">${anim.description}</p>
    </div>
  `;

  card.addEventListener('click', () => openDetail(anim, true));
  return card;
}

function renderGallery() {
  const grid = document.querySelector('.gallery-grid');
  const counter = document.querySelector('.header-meta');
  if (!grid) return;

  grid.innerHTML = '';

  if (animations.length === 0) {
    grid.innerHTML = '<div class="gallery-empty">No animations yet. Describe one in chat and I\'ll build it!</div>';
  } else {
    animations.forEach((anim) => grid.appendChild(createCard(anim)));
  }

  if (counter) counter.textContent = `${animations.length} animation${animations.length !== 1 ? 's' : ''}`;
}

/* ── Screen navigation ──────────────────────── */

function getAnimFromUrl() {
  const id = new URLSearchParams(window.location.search).get('anim');
  if (!id) return null;
  return animations.find((a) => a.id === id) || null;
}

function showGallery() {
  const gallery = document.getElementById('screen-gallery');
  const detail = document.getElementById('screen-detail');
  const stage = document.querySelector('.detail-stage');

  detail.hidden = true;
  gallery.hidden = false;
  document.title = 'Animation Playground';

  if (stage) stage.innerHTML = '';
  currentAnim = null;
}

function showDetail(anim) {
  currentAnim = anim;

  const gallery = document.getElementById('screen-gallery');
  const detail = document.getElementById('screen-detail');
  const title = detail.querySelector('.detail-title');
  const stage = detail.querySelector('.detail-stage');

  title.textContent = anim.name;
  stage.innerHTML = `<iframe src="${anim.folder}/index.html" title="${anim.name}"></iframe>`;

  gallery.hidden = true;
  detail.hidden = false;
  document.title = `${anim.name} · Animation Playground`;
  window.scrollTo(0, 0);
}

function openDetail(anim, pushHistory) {
  showDetail(anim);

  if (pushHistory) {
    const url = new URL(window.location.href);
    url.searchParams.set('anim', anim.id);
    history.pushState({ screen: 'detail', id: anim.id }, '', url);
  }
}

function goBackToGallery() {
  // Prefer the browser back stack when we opened detail from the gallery
  if (history.state?.screen === 'detail') {
    history.back();
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('anim');
  history.replaceState({ screen: 'gallery' }, '', url);
  showGallery();
}

function syncFromUrl() {
  const anim = getAnimFromUrl();
  if (anim) {
    showDetail(anim);
  } else {
    showGallery();
  }
}

/* ── Init ───────────────────────────────────── */

export function init() {
  renderGallery();
  syncFromUrl();

  document.getElementById('btn-back')?.addEventListener('click', goBackToGallery);

  window.addEventListener('popstate', () => {
    syncFromUrl();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentAnim) {
      goBackToGallery();
    }
  });
}
