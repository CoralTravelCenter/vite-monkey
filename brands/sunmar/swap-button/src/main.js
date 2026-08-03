import  "./style.css";
import {awaitDomElement} from "../../../../utils/index.js";
import {createDesktopButton} from "./scripts/createDesktopButton.js";
import {initSwapAnimation} from "./scripts/initSwapAnimations.js";

(async function startSwapButton() {
    const element = createDesktopButton();
    const desktopHeader = '[class*="HeaderMobile_container__"] > div';
    const host = await awaitDomElement(desktopHeader);
    const swapButton = document.querySelector('.swap-button');
    if (!swapButton) {
        host.prepend(element);
        initSwapAnimation();
    }
})();