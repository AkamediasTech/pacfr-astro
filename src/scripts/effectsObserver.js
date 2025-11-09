const initEffectsObserver = () => {
  const targets = document.querySelectorAll('.slideReveal, .fadeReveal, .scaleReveal');
  if (!targets.length) return;

  // Fallback pour les navigateurs sans IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('isVisible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('isVisible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  targets.forEach((el) => observer.observe(el));
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initEffectsObserver, { once: true })
  : initEffectsObserver();

export default initEffectsObserver;