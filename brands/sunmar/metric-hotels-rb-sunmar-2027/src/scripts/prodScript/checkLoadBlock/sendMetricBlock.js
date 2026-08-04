import {waitForElement} from "@utils";
import {sendMetricsLoadBlock} from "./sendMetricLoadBlock.js";

export async function sendMetricsBlock() {
    const targetSelector = '#hotel-selection';
    const targetBlock = await waitForElement(targetSelector);

    const intObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(async (entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                await sendMetricsLoadBlock();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    intObserver.observe(targetBlock);
}