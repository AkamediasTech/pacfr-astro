const initMobileMenu = () => {
  const toggle = document.querySelector("[data-mobile-menu-toggle]");
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");
  if (!toggle || !menu || !overlay) return;

  const openMenu = () => {
    menu.classList.remove("translate-x-full");
    menu.classList.add("translate-x-0");
    overlay.classList.remove("hidden", "opacity-0");
    overlay.classList.add("opacity-100");
    document.body.classList.add("overflow-hidden");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menu.classList.add("translate-x-full");
    menu.classList.remove("translate-x-0");
    overlay.classList.replace("opacity-100", "opacity-0");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
    setTimeout(() => overlay.classList.add("hidden"), 300);
  };

  const toggleMenu = () =>
    toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();

  toggle.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);
  window.addEventListener(
    "keydown",
    (evt) => evt.key === "Escape" && closeMenu()
  );
  menu
    .querySelectorAll("a, button")
    .forEach((el) => el.addEventListener("click", closeMenu));
};

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", initMobileMenu, {
      once: true,
    })
  : initMobileMenu();
export default initMobileMenu;
