import {waitForElement} from "../../../../../utils/index.js";
import {TRANSFER_CHARTER, TRANSFER_REGULAR} from "./keys.ts";
import {openTransferModal} from "./openTransferModal.ts";

export async function identTransfer() {
    try {
        const getValue = (result) =>
            result.status === "fulfilled" ? result.value : null;

        const [charterResult, regularResult] = await Promise.allSettled([
            waitForElement(TRANSFER_CHARTER.container),
            waitForElement(TRANSFER_REGULAR.container),
        ]);

        const charter = getValue(charterResult);
        const regular = getValue(regularResult);

        if (charter !== null) {
            await openTransferModal(TRANSFER_CHARTER);
        }
        if (regular !== null) {
            await openTransferModal(TRANSFER_REGULAR);
        }
    }
    catch {}
}