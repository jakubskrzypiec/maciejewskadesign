(() => {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Splash — once per session, with hard failsafe.
  const splash = qs('#splash');
  const hideSplash = () => splash?.classList.add('is-hidden');
  if (sessionStorage.getItem('md-splash-seen') || reducedMotion) {
    hideSplash();
  } else {
    sessionStorage.setItem('md-splash-seen', '1');
    window.addEventListener('load', () => window.setTimeout(hideSplash, 1450), { once: true });
    window.setTimeout(hideSplash, 2500);
  }

  // Header.
  const header = qs('#siteHeader');
  const setHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 30);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  // Mobile menu.
  const menuToggle = qs('.menu-toggle');
  const mobileMenu = qs('#mobileMenu');
  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileMenu.classList.toggle('is-open', !open);
    mobileMenu.setAttribute('aria-hidden', String(open));
    document.body.classList.toggle('menu-open', !open);
  });
  qsa('a[href^="#"]', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));

  // Reveal on scroll.
  const revealItems = qsa('.reveal, .reveal-media');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 4) * 55, 165)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Hero frames.
  const frames = qsa('.hero-frame');
  const heroProgress = qs('.hero__progress i');
  let frameIndex = 0;
  let heroTimer;
  const restartProgress = () => {
    if (!heroProgress) return;
    heroProgress.classList.remove('animate');
    void heroProgress.offsetWidth;
    heroProgress.classList.add('animate');
  };
  const nextFrame = () => {
    frames[frameIndex]?.classList.remove('is-active');
    frameIndex = (frameIndex + 1) % frames.length;
    frames[frameIndex]?.classList.add('is-active');
    restartProgress();
  };
  if (frames.length > 1 && !reducedMotion) {
    restartProgress();
    heroTimer = window.setInterval(nextFrame, 3400);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) window.clearInterval(heroTimer);
      else heroTimer = window.setInterval(nextFrame, 3400);
    });
  }

  // Hero pseudo-3D movement.
  const hero = qs('.hero');
  const heroMedia = qs('.hero__media');
  if (hero && heroMedia && !reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroMedia.style.transform = `scale(1.055) translate3d(${x * -15}px, ${y * -10}px, 0)`;
    });
    hero.addEventListener('pointerleave', () => heroMedia.style.transform = 'scale(1.04)');
  }

  // Parallax section.
  const parallaxItems = qsa('[data-parallax]');
  const updateParallax = () => {
    if (reducedMotion) return;
    parallaxItems.forEach(item => {
      const rect = item.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const amount = Number(item.dataset.parallax || 0.08);
      const position = (rect.top + rect.height / 2 - window.innerHeight / 2) * amount;
      item.style.transform = `translate3d(0, ${position}px, 0) scale(1.08)`;
    });
  };
  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });

  // Offer accordion and visual switching.
  const offerItems = qsa('.offer-item');
  const offerImage = qs('[data-offer-image]');
  const offerVisual = qs('.offer__visual');
  const visualSources = {
    lines: 'separator-lines.webp',
    materials: 'separator-materials.webp',
    stone: 'separator-stone.webp',
    silhouette: 'separator-silhouette.webp'
  };
  offerItems.forEach(item => {
    qs('button', item)?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      offerItems.forEach(other => {
        other.classList.remove('is-open');
        qs('button', other)?.setAttribute('aria-expanded', 'false');
        const icon = qs('.offer-item__icon', other);
        if (icon) icon.textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('is-open');
        qs('button', item)?.setAttribute('aria-expanded', 'true');
        const icon = qs('.offer-item__icon', item);
        if (icon) icon.textContent = '×';
      }
      const source = visualSources[item.dataset.visual];
      if (source && offerImage && offerImage.getAttribute('src') !== source) {
        offerVisual?.classList.add('is-changing');
        window.setTimeout(() => {
          offerImage.src = source;
          offerVisual?.classList.remove('is-changing');
        }, 220);
      }
    });
  });

  // FAQ.
  qsa('.faq-item').forEach(item => {
    const button = qs('button', item);
    button?.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      qsa('.faq-item').forEach(other => {
        other.classList.remove('is-open');
        qs('button', other)?.setAttribute('aria-expanded', 'false');
        const icon = qs('button i', other);
        if (icon) icon.textContent = '+';
      });
      if (!open) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        const icon = qs('button i', item);
        if (icon) icon.textContent = '×';
      }
    });
  });

  // Project lightbox.
  const lightbox = qs('#lightbox');
  const lightboxImage = qs('img', lightbox);
  const closeLightbox = () => {
    lightbox?.classList.remove('is-open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  };
  qsa('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = card.dataset.full || qs('img', card)?.src || '';
      lightboxImage.alt = qs('img', card)?.alt || 'Realizacja Maciejewska Design';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    });
  });
  qs('.lightbox__close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeLightbox(); closeMenu(); } });

  // Contact: copy a formatted brief and open Messenger without requiring a backend.
  const form = qs('#contactForm');
  const status = qs('#formStatus');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      'Dzień dobry, chciałbym/chciałabym zapytać o projekt wnętrza.',
      '',
      `Imię: ${data.get('name') || '-'}`,
      `Kontakt: ${data.get('contact') || '-'}`,
      `Rodzaj inwestycji: ${data.get('type') || '-'}`,
      `Lokalizacja: ${data.get('location') || '-'}`,
      `Metraż: ${data.get('area') || '-'}`,
      `Opis: ${data.get('message') || '-'}`
    ].join('\n');
    try {
      await navigator.clipboard.writeText(message);
      if (status) status.textContent = 'Treść zapytania została skopiowana. Otwieram Messenger — wystarczy ją wkleić.';
    } catch {
      if (status) status.textContent = 'Otwieram profil na Facebooku. Dane z formularza pozostają widoczne w tej karcie.';
    }
    window.setTimeout(() => window.open('https://m.me/MaciejewskaDesign', '_blank', 'noopener'), 450);
  });

  // Custom cursor.
  const cursor = qs('.cursor');
  if (cursor && window.matchMedia('(pointer:fine)').matches && !reducedMotion) {
    let mouseX = -100, mouseY = -100, currentX = -100, currentY = -100;
    document.addEventListener('pointermove', event => { mouseX = event.clientX; mouseY = event.clientY; });
    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      cursor.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    qsa('a,button,input,textarea,select').forEach(element => {
      element.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      element.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  qs('#year').textContent = String(new Date().getFullYear());
})();
