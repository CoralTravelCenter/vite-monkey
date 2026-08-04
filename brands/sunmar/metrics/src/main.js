import {waitForElement} from "@utils";
import {handleClick} from "./scripts/handleClick.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function promotionMetric() {
  try {
    const selector = 'a.promo-card__link[href*="offers-eb-zima2027"]';
    const link = await waitForElement(selector);

    if (!link) {
      return;
    }

    link.addEventListener('click', (event) => {
      try {
        handleClick(event, selector);
      } catch (error) {
        outputErrorMessage("Ошибка отслеживания клика по баннеру", error);
      }
    });
  } catch (error) {
    outputErrorMessage("Ошибка отслеживания баннера акции", error);
  }
})();