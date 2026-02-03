export function initScrollMenuBehavior(menu, options = {}) {
    if (!menu) return;

    const {
        threshold = 3,
        showDelay = 120,
        pinnedClass = "headroom--pinned",
        unpinnedClass = "headroom--unpinned",
        initialClass = "headroom",
    } = options;

    let lastScrollY = window.scrollY;
    let stopTimer = null;

    // Стартовое состояние
    menu.classList.add(initialClass, pinnedClass);
    menu.classList.remove(unpinnedClass);

    function handleScroll() {
        const currentY = window.scrollY;
        const diff = currentY - lastScrollY;

        if (Math.abs(diff) > threshold) {
            menu.classList.add(unpinnedClass);
            menu.classList.remove(pinnedClass);
        }

        lastScrollY = currentY;

        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => {
            menu.classList.add(pinnedClass);
            menu.classList.remove(unpinnedClass);
        }, showDelay);
    }

    window.addEventListener("scroll", handleScroll, {passive: true});

    // ✅ disposer
    return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(stopTimer);
    };
}
