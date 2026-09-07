import { waitForElement } from "@utils";
import { MARKUP, SELECTOR } from "./keys.js";
import { initFaq } from "./initFaq.js";

export async function initWidget() {
  try {
    const productSummary = await waitForElement(SELECTOR);
    const container = productSummary?.closest("#section-column-1");
    if (!container || container.dataset.SunmarFaqHotelReservation) return;

    container.insertAdjacentHTML("beforeend", MARKUP);
    container.dataset.SunmarFaqHotelReservation = "true";

    const faqContainer = container.querySelector(
      ".Sunmar-FAQ-hotel-reservation",
    );
    if (faqContainer) initFaq(faqContainer);
  } catch {}
}
