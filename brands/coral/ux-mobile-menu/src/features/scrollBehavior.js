import {initScrollMenuBehavior} from "../initScrollMenuBehavior.js";
import {MENU_SHOW_DELAY} from "../constants.js";
import {setupLayoutOffsets} from "./layoutOffsets.js";

export function setupScrollBehavior(customMenu) {
    if (!customMenu) return;

    // offsets должны понимать pinned/unpinned (по умолчанию совпадает)
    const disposeOffsets = setupLayoutOffsets(customMenu, {
        pinnedClass: "headroom--pinned",
        unpinnedClass: "headroom--unpinned",
    });

    const disposeScroll = initScrollMenuBehavior(customMenu, {
        showDelay: MENU_SHOW_DELAY,
        pinnedClass: "headroom--pinned",
        unpinnedClass: "headroom--unpinned",
        initialClass: "headroom",
    });

    return () => {
        disposeOffsets?.();
        disposeScroll?.();
    };
}
