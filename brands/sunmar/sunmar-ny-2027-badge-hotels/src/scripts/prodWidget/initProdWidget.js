import {waitForElement} from "@utils";
import {markup} from "../utils/keys.js";

export async function initProdWidget() {
    const selector = '[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]';
    try {
        const galleryTarget = await waitForElement(selector);

        if (!galleryTarget) return;
        if (galleryTarget.querySelector('.sunmar-ny-2027-badge-root')) return;

        const badgeWrapper = document.createElement('div');
        badgeWrapper.className = 'sunmar-ny-2027-badge-root';
        badgeWrapper.innerHTML = markup;

        galleryTarget.classList.add('sunmar-ny-2027-badge-gallery');
        galleryTarget.insertAdjacentElement('beforeend', badgeWrapper);
    } catch (error) {
        throw new Error("Ошибка поиска галереи или вставки бейджа" + {cause: error});
    }
}
