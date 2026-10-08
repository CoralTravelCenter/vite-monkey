import { waitForElement } from "@utils";
import { button_coutnry_metric } from "../metric/button_coutnry_metric.ts";
import {CARDS_SELECTOR} from "../keys.ts";

export async function waitCountriesButtons() {
  try {
    const container = await waitForElement(CARDS_SELECTOR);
    if (!container || container.dataset.COUNTRYBTNINJECTED) return;

    container.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;

      const button = event.target.closest("button.card__button");
      if (!button || !container.contains(button)) return;

      const card = button.closest(".card");
      const country = card?.querySelector(".card__title")?.textContent?.trim();
      if (!country) return;

      button_coutnry_metric(country);
    });

    container.dataset.COUNTRYBTNINJECTED = "true";
  } catch {}
}
