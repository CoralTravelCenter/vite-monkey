import {getTransfer} from "./getTransfer.ts";
import {hostElement} from "./hostElement.js";
import {transferObject} from "./transferObject.ts";
import {waitForElement} from "../../../../../utils";
import {BUTTON_CONTAINER, TRANSFER_LIST, TRIGGER_SELECTOR} from "./keys.ts";

export async function openTransferModal(transferObj: transferObject) {
    try {
        const transfer = await waitForElement(transferObj.container);
        const transferList = transfer.closest(
            TRANSFER_LIST,
        );
        const transferButton = getTransfer(transferList, transferObj)?.querySelector(
            BUTTON_CONTAINER,
        );
        const trigger = hostElement.querySelector(TRIGGER_SELECTOR);

        if (trigger && transferButton) {
            trigger.addEventListener("click", () => transferButton.click());
        }
    }
    catch {}
}