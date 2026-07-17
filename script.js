
const qs = (s, p=document) => p.querySelector(s);
const qsa = (s, p=document) => [...p.querySelectorAll(s)];

const header = qs('#header');
const syncHeader = () => {
  if (window.scrollY < window.innerHeight * 0.65) header?.classList.add('is-hero');
  else header?.classList.remove('is-hero');
};
syncHeader();
window.addEventListener('scroll', syncHeader);

const burger = qs('#burger');
const mobileNav = qs('#mobileNav');
burger?.addEventListener('click', () => mobileNav?.classList.toggle('is-open'));
qsa('.mobile-nav a').forEach(link => link.addEventListener('click', () => mobileNav?.classList.remove('is-open')));

const heroImages = qsa('.hero__image');
let heroIndex = 0;
if (heroImages.length) {
  setInterval(() => {
    heroImages[heroIndex].classList.remove('is-active');
    heroIndex = (heroIndex + 1) % heroImages.length;
    heroImages[heroIndex].classList.add('is-active');
  }, 3200);
}

const offerImg = qs('#offerImage');
qsa('.offer-item').forEach(item => {
  qs('.offer-item__button', item)?.addEventListener('click', () => {
    const alreadyOpen = item.classList.contains('is-open');
    qsa('.offer-item').forEach(el => {
      el.classList.remove('is-open');
      const icon = qs('.offer-item__icon', el);
      if (icon) icon.textContent = '+';
    });
    if (!alreadyOpen) {
      item.classList.add('is-open');
      const icon = qs('.offer-item__icon', item);
      if (icon) icon.textContent = '−';
      const src = item.dataset.image;
      if (src && offerImg) {
        offerImg.style.opacity = '0';
        offerImg.style.transform = 'scale(1.02)';
        setTimeout(() => {
          offerImg.src = src;
          offerImg.style.opacity = '1';
          offerImg.style.transform = 'scale(1)';
        }, 180);
      }
    }
  });
});

qsa('.faq-item').forEach(item => {
  qs('button', item)?.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    qsa('.faq-item').forEach(el => {
      el.classList.remove('is-open');
      const sign = qs('strong', el);
      if (sign) sign.textContent = '+';
    });
    if (!isOpen) {
      item.classList.add('is-open');
      const sign = qs('strong', item);
      if (sign) sign.textContent = '−';
    }
  });
});
