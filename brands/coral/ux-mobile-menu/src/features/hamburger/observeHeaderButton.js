import {ReactDomObserver} from "../../../../utils.js";
import {SELECTORS} from "../../constants.js";

export function observeHeaderHamburgerButton({onAppear, onDisappear} = {}) {
    const obs = new ReactDomObserver(SELECTORS.headerHamburgerSpecific, {
        onAppear: (btn) => onAppear?.(btn),
        onDisappear: () => onDisappear?.(),
    });

    obs.start();

    return () => obs.stop?.();
}
