import {awaitDomElement} from "@utils";
import markup from "../markup.html";

export async function initProdWidget() {
    const selector = '[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]';
    const galleryTarget = await awaitDomElement(selector);

    if (!galleryTarget) return;

    if (galleryTarget.querySelector('.custom-injected-widget-wrapper')) return;

    const badgeWrapper = document.createElement('div');
    badgeWrapper.className = 'custom-injected-widget-wrapper';
    badgeWrapper.innerHTML = markup;

    galleryTarget.insertAdjacentElement('beforeend', badgeWrapper);
}