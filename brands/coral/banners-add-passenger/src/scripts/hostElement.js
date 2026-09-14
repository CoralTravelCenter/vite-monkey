import {HOST_SELECTOR} from "./keys.ts";
import {waitForElement} from "../../../../../utils/index.js";

async function getHostElement() {
    try {
        return await waitForElement(HOST_SELECTOR);
    } catch {}
}

export const hostElement = await getHostElement();