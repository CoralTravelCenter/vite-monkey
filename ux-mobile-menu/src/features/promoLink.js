import {trackMobileMenu} from "./metrics/mobileMenuMetrics.js";

export function setupPromoLink(link) {
    if (!link) return;

    const onClick = () => {
        trackMobileMenu("promo");
        const href = link.getAttribute("data-link");
        if (!href) return;
        window.open(href, "_blank");
    };

    link.addEventListener("click", onClick);

    return () => link.removeEventListener("click", onClick);
}
