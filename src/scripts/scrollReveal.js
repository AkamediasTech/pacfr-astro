const DEFAULT_VARIANT = 'fade-up';

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
      el.classList.add('is-visible');
      obs.unobserve(el);
    });
  }, { threshold: 0.15 });

  targets.forEach((element) => {
    const variant = element.dataset.reveal || DEFAULT_VARIANT;
    const delay = element.dataset.revealDelay;

    element.classList.add('reveal', `reveal--${variant}`);
    if (delay) {
      element.classList.add(`reveal-delay-${delay}`);
    }

    observer.observe(element);
  });
};

const onReady = () => {
  initScrollReveal();
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', onReady, { once: true })
  : onReady();

export default initScrollReveal;