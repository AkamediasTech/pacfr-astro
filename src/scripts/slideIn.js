import { init } from "astro/virtual-modules/prefetch.js";

const SELECTOR = ".slide";
const VISIBLE_CLASS = "slidevisible";

const initSlideIn = () => {
    const elements = document.querySelectorAll(SELECTOR);
    if (!elements.length) return;

    if(!('IntersectionObserver' in window)) {
        elements.forEach(element => {
            element.classList.add(VISIBLE_CLASS);
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add(VISIBLE_CLASS);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach((el) => {
        el.classList.remove(VISIBLE_CLASS);
        observer.observe(el);
    })
}

document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", initSlideIn, {once: true}) : initSlideIn();

export { initSlideIn };