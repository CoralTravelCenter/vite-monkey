import markup from "../../markup.html?raw";
import {checkLoadBlocks} from "./checkLoadBlocks.js";
import {handleClick} from "../utils/handleClick.js";

export async function initProdWidget() {
    await checkLoadBlocks();

    const hotelsBlock = document.querySelector('[data-v-app]');
    const hotDealsBlock = document.querySelector('.hot-deals-block');
    const customBlock = document.querySelector('#seo-block-place');
    const siblingMenu = document.querySelectorAll('.sibling-menu');

    if (document.querySelector('.custom-injected-widget-wrapper')) {
        return;
    }

    if (!hotelsBlock && !hotDealsBlock && !customBlock) {
        return;
    }

    const bannerBlock = document.createElement('div');
    bannerBlock.className = 'custom-injected-widget-wrapper';

    if (siblingMenu.length > 0) {
        bannerBlock.classList.add('seo-banner--with-menu');
    }

    bannerBlock.innerHTML = markup;
    let inserted = false;

    if (hotelsBlock?.parentElement) {
        hotelsBlock.parentElement.insertAdjacentElement('afterbegin', bannerBlock);
        inserted = true;
    } else if (hotDealsBlock) {
        hotDealsBlock.insertAdjacentElement('beforebegin', bannerBlock);
        inserted = true;
    } else if (customBlock) {
        customBlock.insertAdjacentElement('afterbegin', bannerBlock);
        inserted = true;
    }

    if (inserted) {
        await handleClick(bannerBlock);
    }
}