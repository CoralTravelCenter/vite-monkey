import {waitForElement, insertOnce} from "@utils";
import markup from "../../markup.html?raw";

export async function initProdWidget() {
    try {
        const selector = '[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]';
        const galleryTarget = await waitForElement(selector);

        if (!galleryTarget) return;

        const badgeWrapper = document.createElement('div');
        badgeWrapper.className = 'custom-injected-widget-wrapper';
        badgeWrapper.innerHTML = markup;

        insertOnce(galleryTarget, badgeWrapper, 'beforeend');
    } catch (error) {
        throw new Error("Ошибка поиска галереи или вставки бейджа", {cause: error});
    }
}