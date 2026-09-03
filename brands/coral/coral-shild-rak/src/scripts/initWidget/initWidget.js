import {waitForElement} from "@utils";
import {MARKUP} from "../utils/keys.js";
import {injectTippy} from "../utils/tippy/injectTippy.js";

export async function initWidget() {
    const selector = '[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]';
    try {
        const devContainer = await waitForElement(selector);
        if (devContainer && !devContainer.dataset.CoralShildRakInject) {
            devContainer.insertAdjacentHTML("afterbegin", MARKUP);
            injectTippy();
            devContainer.dataset.CoralShildRakInject = "true";
        }
    }
    catch {}
}