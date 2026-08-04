import {waitForElement} from "@utils";
import {sendMetric} from "./sendMetric.js";

export async function trackFlightTypeLoad() {
    await waitForElement(
        '[data-testid="ptff-charter-tab-btn"], [data-testid="ptff-regular-tab-btn"]',
        {timeoutMs: 0}
    );

    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            try {
                const charterBtn = document.querySelector(
                    '[data-testid="ptff-charter-tab-btn"]'
                );
                const regularBtn = document.querySelector(
                    '[data-testid="ptff-regular-tab-btn"]'
                );

                let goalName = null;

                if (charterBtn?.classList.contains('active-btn')) {
                    goalName = 'flight_charter';
                } else if (regularBtn?.classList.contains('active-btn')) {
                    goalName = 'flight_regular';
                }

                if (!goalName) return;
                if (!sendMetric(goalName)) return;

                clearInterval(intervalId);
                resolve();
            } catch (error) {
                clearInterval(intervalId);
                reject(error);
            }
        }, 500);
    });
}