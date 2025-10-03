const initScrollReveal = () => {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((element) => observer.observe(element));
};

initScrollReveal();
