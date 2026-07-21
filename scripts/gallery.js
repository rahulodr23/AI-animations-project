import { animations } from './registry.js';

const BADGE_CLASS = { css: 'badge-css', gsap: 'badge-gsap', lottie: 'badge-lottie' };

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

  card.addEventListener('click', () => openViewer(anim));
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

/* ── Viewer ─────────────────────────────────── */

let currentAnim = null;

function openViewer(anim) {
  currentAnim = anim;
  const overlay = document.getElementById('viewer');
  const title = overlay.querySelector('.viewer-title');
  const stage = overlay.querySelector('.viewer-stage');
  const exportPanel = overlay.querySelector('.export-panel');

  title.textContent = anim.name;
  stage.innerHTML = `<iframe src="${anim.folder}/index.html" title="${anim.name}"></iframe>`;

  if (exportPanel) {
    exportPanel.classList.remove('active');
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeViewer() {
  const overlay = document.getElementById('viewer');
  const stage = overlay.querySelector('.viewer-stage');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { stage.innerHTML = ''; currentAnim = null; }, 300);
}

/* ── Player Controls ────────────────────────── */

function replayAnimation() {
  if (!currentAnim) return;
  const stage = document.querySelector('.viewer-stage');
  const src = `${currentAnim.folder}/index.html`;
  stage.innerHTML = `<iframe src="${src}" title="${currentAnim.name}"></iframe>`;
}

/* ── Recording (MP4 / GIF) ──────────────────── */

let mediaRecorder = null;
let recordedChunks = [];

async function startRecording(format) {
  const iframe = document.querySelector('.viewer-stage iframe');
  if (!iframe) return;

  const recordBtn = document.getElementById('btn-record');
  const gifBtn = document.getElementById('btn-gif');

  try {
    const stream = iframe.contentDocument
      ? iframe.contentDocument.querySelector('canvas')?.captureStream?.(30)
      : null;

    let captureStream = stream;

    if (!captureStream) {
      const stage = document.querySelector('.viewer-stage');
      const canvas = document.createElement('canvas');
      const rect = stage.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;

      captureStream = canvas.captureStream(30);

      const ctx = canvas.getContext('2d');
      const video = document.createElement('video');
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        preferCurrentTab: true,
      });
      video.srcObject = displayStream;
      await video.play();

      const drawFrame = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(drawFrame);
        } else {
          displayStream.getTracks().forEach(t => t.stop());
        }
      };
      requestAnimationFrame(drawFrame);
    }

    recordedChunks = [];
    const mimeType = format === 'gif' ? 'video/webm' : (MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm');
    mediaRecorder = new MediaRecorder(captureStream, { mimeType });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mimeType });
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentAnim?.id || 'animation'}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);

      recordBtn.textContent = '⏺ Record MP4';
      recordBtn.classList.remove('recording');
      gifBtn.disabled = false;
      showToast(`Downloaded as .${ext}`);
    };

    mediaRecorder.start();
    recordBtn.textContent = '⏹ Stop Recording';
    recordBtn.classList.add('recording');
    gifBtn.disabled = true;

    replayAnimation();
    setTimeout(() => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    }, 5000);

  } catch (err) {
    console.error('Recording failed:', err);
    showToast('Recording requires screen sharing permission');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
}

function handleRecordClick() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    stopRecording();
  } else {
    startRecording('mp4');
  }
}

/* ── Embed / Export Panel ───────────────────── */

function toggleExportPanel() {
  const panel = document.querySelector('.export-panel');
  if (!panel || !currentAnim) return;
  panel.classList.toggle('active');

  if (panel.classList.contains('active')) {
    showEmbedCode('iframe');
  }
}

function showEmbedCode(tab) {
  if (!currentAnim) return;

  document.querySelectorAll('.export-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.export-tab[data-tab="${tab}"]`)?.classList.add('active');

  const codeEl = document.querySelector('.export-code code');
  if (!codeEl) return;

  const baseUrl = window.location.origin;

  if (tab === 'iframe') {
    codeEl.textContent = `<iframe src="${baseUrl}${currentAnim.folder}/index.html" width="400" height="300" style="border:none;border-radius:12px;" title="${currentAnim.name}"></iframe>`;
  } else if (tab === 'link') {
    codeEl.textContent = `${baseUrl}${currentAnim.folder}/index.html`;
  } else if (tab === 'info') {
    codeEl.textContent = `Type: ${currentAnim.type}\nTags: ${currentAnim.tags.join(', ')}\nFolder: ${currentAnim.folder}\n\nTo use in your project:\n1. Copy the animation folder into your project\n2. Include GSAP / Lottie if needed (see animation type)\n3. Open index.html or embed as iframe`;
  }
}

function copyExportCode() {
  const codeEl = document.querySelector('.export-code code');
  if (!codeEl) return;
  navigator.clipboard.writeText(codeEl.textContent).then(() => showToast('Copied to clipboard'));
}

/* ── Toast ──────────────────────────────────── */

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ── Init ───────────────────────────────────── */

export function init() {
  renderGallery();

  document.querySelector('.viewer-close')?.addEventListener('click', closeViewer);
  document.getElementById('viewer')?.addEventListener('click', (e) => {
    if (e.target.id === 'viewer') closeViewer();
  });

  document.getElementById('btn-replay')?.addEventListener('click', replayAnimation);
  document.getElementById('btn-record')?.addEventListener('click', handleRecordClick);
  document.getElementById('btn-embed')?.addEventListener('click', toggleExportPanel);

  document.querySelectorAll('.export-tab').forEach(tab => {
    tab.addEventListener('click', () => showEmbedCode(tab.dataset.tab));
  });

  document.querySelector('.copy-btn')?.addEventListener('click', copyExportCode);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeViewer();
  });
}
