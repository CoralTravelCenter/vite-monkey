export function initScrollMenuBehavior(menu, options = {}) {
  if (!menu) return;

  const {
    threshold = 3,           // чувствительность "движения" скролла
    showDelay = 120,         // через сколько вернуть меню после остановки
    pinnedClass = "headroom--pinned",
    unpinnedClass = "headroom--unpinned",
    initialClass = "headroom"
  } = options;

  let lastScrollY = window.scrollY;
  let stopTimer = null;

  // Стартовое состояние
  menu.classList.add(initialClass, pinnedClass);

  function handleScroll() {
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY;

    // Любой скролл → скрыть меню
    if (Math.abs(diff) > threshold) {
      menu.classList.add(unpinnedClass);
      menu.classList.remove(pinnedClass);
    }

    lastScrollY = currentY;

    // Остановка скролла → вернуть меню
    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => {
      menu.classList.add(pinnedClass);
      menu.classList.remove(unpinnedClass);
    }, showDelay);
  }

  window.addEventListener("scroll", handleScroll, {passive: true});
}
