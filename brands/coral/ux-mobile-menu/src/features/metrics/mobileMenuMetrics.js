const COUNTER_ID = 96674199;
const GOAL = "ab_mobile_menu";

/**
 * Разрешённые ключи (контракт с аналитикой/тестом)
 */
export const MOBILE_MENU_METRIC_LINK = {
    promo: "promo",
    jivo: "jivo",
    account: "account",
    menu: "menu",
};

/**
 * Отправка метрики по клику на элементы мобильного меню.
 *
 * Важно:
 * - вызывать синхронно внутри user gesture (click/tap)
 * - не await и не setTimeout вокруг вызова
 */
export function trackMobileMenu(linkKey) {
    const link = MOBILE_MENU_METRIC_LINK[linkKey];
    if (!link) return;

    const ym = window.ym;
    if (typeof ym !== "function") return;

    try {
        ym(COUNTER_ID, "reachGoal", GOAL, {link});
    } catch {
    }
}
