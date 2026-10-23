import {waitForElement} from "@utils";
import {DESKTOP_HEADER} from "./utils/keys.js";
import {createDesktopWidget} from "./createDesktopWidget.js";

export async function initDesktopWidget() {
    try {
        const element = createDesktopWidget();
        const host = await waitForElement(DESKTOP_HEADER);
        if (host) {
            host.prepend(element);
        }
    }
    catch {}
}