
const qs = (s, p=document) => p.querySelector(s);
const qsa = (s, p=document) => [...p.querySelectorAll(s)];

window.addEventListener('load', () => {
  setTimeout(() => qs('#intro')?.classList.add('is-hidden'), 1100);
});

const burger = qs('#burger');
const mobileNav = qs('#mobileNav');
burger?.addEventListener('click', () => {
  mobileNav?.classList.toggle('is-open');
});
qsa('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => mobileNav?.classList.remove('is-open'));
});

const heroImages = qsa('.hero__image');
let heroIndex = 0;
if (heroImages.length) {
  setInterval(() => {
    heroImages[heroIndex].classList.remove('is-active');
    heroIndex = (heroIndex + 1) % heroImages.length;
    heroImages[heroIndex].classList.add('is-active');
  }, 3400);
}

const offerVisualImage = qs('#offerVisualImage');
qsa('.offer-item').forEach(item => {
  const button = qs('.offer-item__button', item);
  button?.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    qsa('.offer-item').forEach(el => {
      el.classList.remove('is-open');
      const sign = qs('.offer-item__plus', el);
      if (sign) sign.textContent = '+';
    });
    if (!isOpen) {
      item.classList.add('is-open');
      const sign = qs('.offer-item__plus', item);
      if (sign) sign.textContent = '−';
      const src = item.dataset.image;
      if (src && offerVisualImage) {
        offerVisualImage.style.opacity = '0';
        offerVisualImage.style.transform = 'scale(1.03)';
        setTimeout(() => {
          offerVisualImage.src = src;
          offerVisualImage.style.opacity = '1';
          offerVisualImage.style.transform = 'scale(1)';
        }, 180);
      }
    }
  });
});

qsa('.faq-item').forEach(item => {
  const btn = qs('button', item);
  btn?.addEventListener('click', () => {
    const open = item.classList.contains('is-open');
    qsa('.faq-item').forEach(el => {
      el.classList.remove('is-open');
      const sign = qs('strong', el);
      if (sign) sign.textContent = '+';
    });
    if (!open) {
      item.classList.add('is-open');
      const sign = qs('strong', item);
      if (sign) sign.textContent = '−';
    }
  });
});
