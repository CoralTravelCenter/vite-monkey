import {waitForElement} from "@utils";
import {kv_bf_metric} from "../metric/kv_bf_metric.ts";
import {KV_SELECTOR} from "../keys.ts";

export async function waitKvButton() {
    try {
        const container = await waitForElement(KV_SELECTOR);
        if (container && !container.dataset.KVBTNINJECTED) {
            container.addEventListener('click', () => {
                kv_bf_metric();
            })
            container.dataset.KVBTNINJECTED = "true";
        }
    }
    catch {}
}