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

// ── Lightbox ──────────────────────────────────────────────────
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox?.querySelector('.lightbox__img');
const lightboxClose = lightbox?.querySelector('.lightbox__close');

document.querySelectorAll('[data-lightbox]').forEach(trigger => {
  trigger.style.cursor = 'zoom-in';
  trigger.addEventListener('click', () => {
    const src = trigger.dataset.lightbox || trigger.src || trigger.querySelector('img')?.src;
    const alt = trigger.dataset.alt || trigger.querySelector('img')?.alt || '';
    if (lightbox && lightboxImg && src) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
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
