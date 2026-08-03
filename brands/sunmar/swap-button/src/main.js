import  "./style.css";
import {waitForElement} from "@utils";
import {createDesktopButton} from "./scripts/createDesktopButton.js";
import {initSwapAnimation} from "./scripts/initSwapAnimations.js";

(async function startSwapButton() {
    const element = createDesktopButton();
    const desktopHeader = '[class*="HeaderMenuBar_container"] > div';
    const host = await waitForElement(desktopHeader);
    const swapButton = document.querySelector('.swap-button');
    if (!swapButton) {
        host.prepend(element);
        initSwapAnimation();
    }
})();
