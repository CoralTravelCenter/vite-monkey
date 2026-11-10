import { sendMetric } from "../utils/sendMetric.js";

export function initAccordion(faqBlock) {
    faqBlock.addEventListener("click", function(event) {
        const header = event.target.closest(".js-toggle-header");
        if (!header) {
            return;
        }

        const toggle = header.closest(".js-toggle");
        const body = toggle.querySelector(".js-toggle-body");
        const isOpen = toggle.classList.toggle("active");
        header.setAttribute("aria-expanded", String(isOpen));
        body.hidden = !isOpen;

        if (isOpen && !toggle.dataset.HEADER_TOGGLE) {
            sendMetric();
            toggle.dataset.HEADER_TOGGLE = "true";
        }
    });

    faqBlock.addEventListener("keydown", function(event) {
        if ((event.key === "Enter" || event.key === " ") && event.target.matches(".js-toggle-header")) {
            event.preventDefault();
            if (!event.repeat) {
                event.target.click();
            }
        }
    });
}
