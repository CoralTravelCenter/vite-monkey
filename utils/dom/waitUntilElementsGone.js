export function waitUntilElementsGone(config, callback) {
    const requiredSelectors = config.required || [];
    const floatingSelectors = config.floating || [];

    const hasAny = (selectors) =>
        selectors.some((sel) => document.querySelector(sel));

    const allGone = (selectors) =>
        selectors.every((sel) => !document.querySelector(sel));

    let observer = null;

    const tryFinish = () => {
        // ждем, пока ВСЕ required исчезнут
        if (!allGone(requiredSelectors)) return;

        // и ВСЕ floating (если есть) тоже исчезнут
        if (!allGone(floatingSelectors)) return;

        observer?.disconnect();
        callback();
    };

    // стартовая проверка
    const anyRequiredNow = hasAny(requiredSelectors);

    // если required вообще нет "сразу" — сразу идём дальше
    if (requiredSelectors.length > 0 && !anyRequiredNow) {
        callback();
        return;
    }

    // кейс: required есть, но уже всё исчезло (например, скрипт включили поздно)
    if (allGone(requiredSelectors) && allGone(floatingSelectors)) {
        callback();
        return;
    }

    // наблюдаем за изменениями DOM
    observer = new MutationObserver(tryFinish);
    observer.observe(document.body, {childList: true, subtree: true});
}
