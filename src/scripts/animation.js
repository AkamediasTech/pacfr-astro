document.addEventListener('DOMContentLoaded', () => {
  const stats = document.querySelectorAll('.stats h3');
  const fades = document.querySelectorAll('.fade-text-auto');

  // Prépare chaque compteur
  stats.forEach((stat) => {
    stat.dataset.value = stat.textContent;
    stat.textContent = '0';
  });

  // File d’attente pour jouer les compteurs dans l’ordre d’apparition
  const animationQueue = [];
  let isAnimating = false;

  const startNextAnimation = () => {
    if (isAnimating || animationQueue.length === 0) return;
    isAnimating = true;

    const element = animationQueue.shift();
    const targetValue = element?.dataset.value;
    if (!targetValue) {
      isAnimating = false;
      startNextAnimation();
      return;
    }

    animateNumbers(element, targetValue, () => {
      isAnimating = false;
      startNextAnimation();
    });
  };

  // Observer pour les compteurs
  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animationQueue.push(entry.target);
        observer.unobserve(entry.target);
        startNextAnimation();
      });
    },
    { threshold: 0.4 }
  );

  stats.forEach((stat) => statsObserver.observe(stat));

  // Observer fade-in
  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  fades.forEach((el) => fadeObserver.observe(el));

  function animateNumbers(element, targetValue, callback) {
    const target = parseInt(targetValue.replace('%', ''), 10);
    const isPercentage = targetValue.includes('%');
    const steps = 50;
    const increment = Math.max(1, Math.ceil(target / steps));
    const speed = 15;
    let count = 0;

    const interval = setInterval(() => {
      count += increment;
      if (count >= target) {
        count = target;
        clearInterval(interval);
        if (callback) callback();
      }
      element.textContent = count + (isPercentage ? '%' : '');
    }, speed);
  }
});