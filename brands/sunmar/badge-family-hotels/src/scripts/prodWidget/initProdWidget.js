import {waitForElement} from "@utils";
import {markup} from "../utils/keys.js";

export async function initProdWidget() {
    const selector = '[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]';
    try {
        const galleryTarget = await waitForElement(selector);

        if (!galleryTarget) return;
        if (galleryTarget.querySelector('.custom-injected-widget-wrapper')) return;

        const badgeWrapper = document.createElement('div');
        badgeWrapper.className = 'custom-injected-widget-wrapper';
        badgeWrapper.innerHTML = markup;

        galleryTarget.insertAdjacentElement('beforeend', badgeWrapper);
    } catch (error) {
        throw new Error("Ошибка поиска галереи или вставки бейджа" + {cause: error});
    }
}