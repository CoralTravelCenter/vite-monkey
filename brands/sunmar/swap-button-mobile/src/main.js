import './style.css';
import {awaitDomElement, reactDomObserver} from '../../../../utils/index.js';
import { createMobileButton } from './scripts/createMobileButton.js';
import { initSwapAnimation } from './scripts/initSwapAnimations.js';


(async function startSwapButton() {
    const mobileHeader = '[class*="HeaderMobile_rightGroup__"]';
    const domWatcher = reactDomObserver();
    const host = await domWatcher.waitElement(mobileHeader);
    const element = createMobileButton();
    const swapButton = document.querySelector('.swap-button-mobile');
    console.log(host);
    if (!swapButton) {
        host.insertAdjacentElement('beforebegin', element);
        // initSwapAnimation();
    }
})();
