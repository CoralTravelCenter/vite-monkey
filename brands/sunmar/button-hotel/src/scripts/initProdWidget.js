import {waitForElement} from "@utils";
import markup from "../markup.html?raw";

export async function initProdWidget() {
    try {
        const selector = '[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]';
        const galleryTarget = await waitForElement(selector);

        if (!galleryTarget) return;
        if (galleryTarget.querySelector('.custom-injected-widget-wrapper')) return;

        const badgeWrapper = document.createElement('div');
        badgeWrapper.className = 'custom-injected-widget-wrapper';
        badgeWrapper.innerHTML = markup;

        galleryTarget.insertAdjacentElement('beforeend', badgeWrapper);
    }
    catch (error) {
        console.error(`Не удалось получить элемент: ${error}`);
    }
}