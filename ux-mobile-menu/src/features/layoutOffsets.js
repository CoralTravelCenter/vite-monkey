import {ReactDomObserver} from "../../../utils.js";

const DEFAULTS = {
    compareNotifSelector:
        ".hotelCompareNotificationWrapper .ant-notification-notice-wrapper",

    bodyClassMenuVisible: "cmenu-visible",
    bodyClassCompareNotif: "cmp-notif",

    // эти классы должны совпадать с initScrollMenuBehavior options
    pinnedClass: "headroom--pinned",
    unpinnedClass: "headroom--unpinned",
};

export function setupLayoutOffsets(menuEl, opts = {}) {
    const o = {...DEFAULTS, ...opts};

    // 1) compare notif -> body.cmp-notif
    const notifObs = new ReactDomObserver(o.compareNotifSelector, {
        onAppear: () => document.body.classList.add(o.bodyClassCompareNotif),
        onDisappear: () => document.body.classList.remove(o.bodyClassCompareNotif),
    });
    notifObs.start();

    // 2) menu pinned/unpinned -> body.cmenu-visible
    const isMenuVisible = () => {
        if (!menuEl) return false;
        if (menuEl.classList.contains(o.unpinnedClass)) return false;
        if (menuEl.classList.contains(o.pinnedClass)) return true;
        // на всякий случай: если нет ни того ни другого — считаем видимым
        return true;
    };

    const applyMenuClass = () => {
        document.body.classList.toggle(o.bodyClassMenuVisible, isMenuVisible());
    };

    applyMenuClass();

    const mo =
        menuEl instanceof HTMLElement
            ? new MutationObserver(() => applyMenuClass())
            : null;

    mo?.observe(menuEl, {
        attributes: true,
        attributeFilter: ["class"], // нам достаточно class
    });

    return () => {
        notifObs.stop?.();
        mo?.disconnect();

        document.body.classList.remove(o.bodyClassCompareNotif);
        document.body.classList.remove(o.bodyClassMenuVisible);
    };
}
