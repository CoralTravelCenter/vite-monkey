import markup from "./markup.html?raw";
import "./styles/style.scss";

import {guardSingleton} from "./lifecycle/singletonGuard.js";
import {createDisposer} from "./lifecycle/createDisposer.js";

import {insertMenu} from "./dom/insertMenu.js";
import {getElements} from "./dom/getElements.js";
import {createPageTriggers} from "./dom/setPageTriggers.js";

import {setupScrollBehavior} from "./features/scrollBehavior.js";
import {setupPromoLink} from "./features/promoLink.js";
import {setupChatLink} from "./features/chatLink.js";
import {setupUserLink} from "./features/userLink/index.js";
import {setupHamburger} from "./features/hamburger/index.js";
import {setupFlightStickyBar} from "./features/flightStickyBar.js";

guardSingleton("customMobileMenu", () => {
    const d = createDisposer();

    insertMenu({markup});
    const els = getElements();

    const page = createPageTriggers();
    page.applyFromLocation();

    if (els.customMenu) d.add(setupScrollBehavior(els.customMenu));
    d.add(setupPromoLink(els.customPromoLink));
    d.add(setupChatLink(els.customChatLink));

    d.add(setupUserLink(els.customLogin));
    d.add(setupHamburger(els.customHamburger, {onRoute: () => page.applyFromLocation()}));
    d.add(setupFlightStickyBar({onRestore: () => page.applyFromLocation()}));

    CoralShadowPart.connect({
        host: "#qz-container",
        target: ".go396308648",
        part: "bubble",
    });
    CoralShadowPart.connect({
        host: "#qz-container",
        target: ".go3884184814",
        part: "card",
    });


    return d.dispose;
});
