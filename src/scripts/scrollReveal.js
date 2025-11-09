// data-reveal="slide-right"/slide-left/fade-up choisit la variante.
// data-reveal-distance="60px" (ou rem, %, etc.) définit la translation initiale.
// data-reveal-duration="900ms" contrôle la durée (en ms).
// data-reveal-delay="120ms" applique un délai individuel.
// data-reveal-easing accepte n’importe quelle courbe CSS : 
//   cubic-bezier(0.22, 1, 0.36, 1)
//   cubic-bezier(0.8, 0, 0.2, 1)
//   cubic-bezier(0.4, 0, 1, 1) 




const DEFAULT_VARIANT = 'fade-up';
const DEFAULT_OPTIONS = {
  threshold: 0.2,
  rootMargin: '0px',
}

const applyCustomProperties = (el) => {
  const {
    revealDelay,
    revealDuration,
    revealEasing,
    revealDistance,
    revealAxis
  } = el.dataset;

  if (revealDelay) {
    el.style.setProperty('--reveal-delay', revealDelay);
  }
  if (revealDuration) {
    el.style.setProperty('--reveal-duration', revealDuration);
  }
  if (revealEasing) {
    el.style.setProperty('--reveal-easing', revealEasing);
  }
  if (revealDistance) {
    el.style.setProperty('--reveal-distance', revealDistance);
  }
  if (revealAxis) {
    el.style.setProperty('--reveal-axis', revealAxis);
  }
}

const initScrollReveal = () => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const el = entry.target;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('is-visible');
        });
      });
      obs.unobserve(el);
    });
  },  DEFAULT_OPTIONS);

  targets.forEach((element) => {
    const variant = element.dataset.reveal || DEFAULT_VARIANT;

    element.classList.add('reveal', `reveal--${variant}`);
    applyCustomProperties(element);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        observer.observe(element);
      });
    });
  });
};

const onReady = () => {
  initScrollReveal();
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', onReady, { once: true })
  : onReady();

export default initScrollReveal;