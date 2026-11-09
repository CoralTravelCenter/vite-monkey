import {sendMetric} from "../utils/sendMetric.js";

export async function hostReactAppReadyAccord(
    selector = "#__next > div",
    timeout = 500
) {
    return new Promise(function(resolve) {
        function waiter() {
            const host_el = document.querySelector(selector);
            if (host_el && host_el.getBoundingClientRect().height) {
                resolve();
            } else {
                setTimeout(waiter, timeout);
            }
        }
        waiter();
    });
}


document.addEventListener("click", function(event) {
    const header = event.target.closest(".js-toggle-header");

    if (!header) {
        return;
    }

    const toggle = header.closest(".js-toggle");
    const body = toggle.querySelector(".js-toggle-body");

    if (toggle && body) {
        const isOpen = toggle.classList.contains("active");

        if (isOpen) {
            closeAccordion(toggle, body);
        } else {
            openAccordion(toggle, body);
        }
    }
});

function openAccordion(container, body) {
    container.classList.add("active");
    body.style.maxHeight = body.scrollHeight + "px";
    if (!container.dataset.HEADER_TOGGLE) {
        sendMetric();
        container.dataset.HEADER_TOGGLE = "true";
    }
}

function closeAccordion(container, body) {
    container.classList.remove("active");
    body.style.maxHeight = 0;
}