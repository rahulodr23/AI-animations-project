import { animations } from './registry.js';

const BADGE_CLASS = { css: 'badge-css', gsap: 'badge-gsap', lottie: 'badge-lottie' };

let currentAnim = null;
/** Preview container that currently “owns” the detail iframe (so we can return it). */
let detailSourceCard = null;

function isLiveSrc(iframe) {
  const src = iframe.getAttribute('src');
  return Boolean(src) && src !== 'about:blank';
}

function createCard(anim) {
  const card = document.createElement('article');
  card.className = 'anim-card';
  card.dataset.id = anim.id;

  card.innerHTML = `
    <div class="anim-card-preview">
      <iframe data-src="${anim.folder}/index.html" title="${anim.name}" loading="lazy"></iframe>
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

/** Start loading gallery preview iframes (only while gallery is visible). */
function resumeGalleryPreviews() {
  document.querySelectorAll('.anim-card-preview iframe').forEach((iframe) => {
    const src = iframe.dataset.src;
    if (src && !isLiveSrc(iframe)) {
      iframe.src = src;
    }
  });
}

/** Stop other previews so they don’t compete with the detail page. */
function pauseGalleryPreviews(exceptId) {
  document.querySelectorAll('.anim-card').forEach((card) => {
    if (exceptId && card.dataset.id === exceptId) return;
    const iframe = card.querySelector('iframe');
    if (!iframe) return;
    if (!iframe.dataset.src && isLiveSrc(iframe)) {
      iframe.dataset.src = iframe.getAttribute('src');
    }
    if (isLiveSrc(iframe)) {
      iframe.src = 'about:blank';
    }
  });
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
  const iframe = stage?.querySelector('iframe');

  // Put the detail iframe back into its card preview (no reload)
  if (iframe && detailSourceCard) {
    detailSourceCard.appendChild(iframe);
  } else if (stage) {
    stage.innerHTML = '';
  }

  detailSourceCard = null;
  currentAnim = null;

  detail.hidden = true;
  gallery.hidden = false;
  document.title = 'Animation Playground';

  resumeGalleryPreviews();
}

function showDetail(anim) {
  currentAnim = anim;

  const gallery = document.getElementById('screen-gallery');
  const detail = document.getElementById('screen-detail');
  const title = detail.querySelector('.detail-title');
  const stage = detail.querySelector('.detail-stage');
  const card = document.querySelector(`.anim-card[data-id="${anim.id}"]`);
  const previewHost = card?.querySelector('.anim-card-preview') || null;
  const previewIframe = previewHost?.querySelector('iframe') || null;

  title.textContent = anim.name;

  // Free bandwidth/CPU from every other preview
  pauseGalleryPreviews(anim.id);

  stage.innerHTML = '';
  detailSourceCard = previewHost;

  if (previewIframe) {
    // Reuse the card’s iframe when it’s already loaded — avoids a second fetch
    if (!isLiveSrc(previewIframe)) {
      previewIframe.src = previewIframe.dataset.src || `${anim.folder}/index.html`;
    }
    previewIframe.title = anim.name;
    stage.appendChild(previewIframe);
  } else {
    const iframe = document.createElement('iframe');
    iframe.dataset.src = `${anim.folder}/index.html`;
    iframe.src = `${anim.folder}/index.html`;
    iframe.title = anim.name;
    stage.appendChild(iframe);
  }

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

  // If we land on a detail URL, don’t start all gallery iframes first
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
