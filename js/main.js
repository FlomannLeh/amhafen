/* ============================================================
   Gästehaus Am Hafen — Main JS
   ============================================================ */

// ── Navigation: Sticky + Scroll ──────────────────────────────
const nav = document.querySelector('.nav');

function updateNav() {
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Aktuelles Jahr im Footer ──────────────────────────────────
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ── Mobile Menu ───────────────────────────────────────────────
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.nav__mobile');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ── Reveal on Scroll ──────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');

if (reveals.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => observer.observe(el));
}

// ── Lightbox + Galerie ────────────────────────────────────────
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox?.querySelector('.lightbox__img');
const lightboxClose = lightbox?.querySelector('.lightbox__close');
const lightboxPrev = lightbox?.querySelector('.lightbox__nav--prev');
const lightboxNext = lightbox?.querySelector('.lightbox__nav--next');
const lightboxCounter = lightbox?.querySelector('.lightbox__counter');

let galleryItems = [];
let galleryIndex = 0;

function showGalleryImage() {
  if (!lightboxImg || galleryItems.length === 0) return;
  const item = galleryItems[galleryIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt || '';
  if (lightboxCounter) {
    lightboxCounter.textContent = galleryItems.length > 1
      ? `${galleryIndex + 1} / ${galleryItems.length}` : '';
  }
}

function openLightbox(items, index) {
  if (!lightbox || !lightboxImg || items.length === 0) return;
  galleryItems = items;
  galleryIndex = Math.max(0, index);
  lightbox.classList.toggle('lightbox--gallery', items.length > 1);
  showGalleryImage();
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function stepGallery(dir) {
  if (galleryItems.length < 2) return;
  galleryIndex = (galleryIndex + dir + galleryItems.length) % galleryItems.length;
  showGalleryImage();
}

// Galerie-Daten je Kategorie aus den Album-Grids sammeln (Reihenfolge bleibt erhalten)
const galleries = {};
document.querySelectorAll('.room-album__grid').forEach(grid => {
  const items = [...grid.querySelectorAll('.room-album__item')].map(btn => ({
    src: btn.dataset.src,
    alt: btn.dataset.alt || ''
  }));
  const first = grid.querySelector('.room-album__item');
  if (first) galleries[first.dataset.gallery] = items;
});

// Klick auf Karten-Bild oder Album-Thumbnail öffnet die Galerie
document.querySelectorAll('[data-gallery]:not(.room-album__grid)').forEach(trigger => {
  trigger.style.cursor = 'zoom-in';
  trigger.addEventListener('click', () => {
    const items = galleries[trigger.dataset.gallery] || [];
    let idx = items.findIndex(i => i.src === trigger.dataset.src);
    if (idx < 0) idx = 0;
    openLightbox(items, idx);
  });
});

// Einzelbild-Lightbox (übrige Seiten mit data-lightbox)
document.querySelectorAll('[data-lightbox]').forEach(trigger => {
  trigger.style.cursor = 'zoom-in';
  trigger.addEventListener('click', () => {
    const src = trigger.dataset.lightbox || trigger.src || trigger.querySelector('img')?.src;
    const alt = trigger.dataset.alt || trigger.querySelector('img')?.alt || '';
    if (src) openLightbox([{ src, alt }], 0);
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', e => { e.stopPropagation(); stepGallery(-1); });
lightboxNext?.addEventListener('click', e => { e.stopPropagation(); stepGallery(1); });
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') stepGallery(-1);
  else if (e.key === 'ArrowRight') stepGallery(1);
});

// ── Fotoalbum auf-/zuklappen ──────────────────────────────────
document.querySelectorAll('.room-album__toggle').forEach(btn => {
  const label = btn.querySelector('span');
  btn.addEventListener('click', () => {
    const grid = document.getElementById(btn.getAttribute('aria-controls'));
    if (!grid) return;
    const willOpen = grid.hasAttribute('hidden');
    grid.toggleAttribute('hidden', !willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));
    if (label) label.textContent = willOpen ? 'Fotoalbum schließen' : 'Fotoalbum ansehen';
  });
});

// ── Smooth Scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = (parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Active Nav Link ───────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link, .nav__mobile .nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('nav__link--active');
  }
});

// ── Booking form date defaults ────────────────────────────────
const anreise = document.getElementById('anreise');
const abreise = document.getElementById('abreise');

if (anreise && abreise) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const fmt = d => d.toISOString().split('T')[0];
  anreise.min = fmt(tomorrow);
  abreise.min = fmt(dayAfter);

  anreise.addEventListener('change', () => {
    const minAbr = new Date(anreise.value);
    minAbr.setDate(minAbr.getDate() + 1);
    abreise.min = fmt(minAbr);
    if (abreise.value && new Date(abreise.value) <= new Date(anreise.value)) {
      abreise.value = fmt(minAbr);
    }
  });
}

// ── Formulare via Web3Forms (Buchung + Kontakt) ───────────────
document.querySelectorAll('form[action*="web3forms.com"]').forEach((form) => {
  const status = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const original = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Wird gesendet…'; }
    if (status) { status.hidden = true; status.classList.remove('form-status--error'); }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = 'danke.html';
        return;
      }
      throw new Error(data.message || 'Senden fehlgeschlagen');
    } catch (err) {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
      if (status) {
        status.hidden = false;
        status.classList.add('form-status--error');
        status.textContent = 'Das Senden hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an: 07532 / 7069.';
      }
    }
  });
});
