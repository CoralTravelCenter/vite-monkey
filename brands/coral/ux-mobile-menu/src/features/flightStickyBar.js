import {ReactDomObserver} from "../../../utils.js";
import {SELECTORS} from "../constants.js";

export function setupFlightStickyBar({onRestore} = {}) {
    const obs = new ReactDomObserver(SELECTORS.flightSticky, {
        onAppear: () => {
            document.body.setAttribute("data-page", "flight");
        },
        onDisappear: () => {
            onRestore?.();
        },
    });

    obs.start();

    return () => obs.stop?.();
}
