import {waitForElement} from "@utils";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function injectMetric(){
  const selector = 'li.promo-card.sunmar a.promo-card__link[href*="puteshestvie-novyi-god"]';
  const metric = "ym(215233, 'reachGoal', 'entry_point', {name_stock: {NY_26_27: {name_point: 'promo_page',},},});";
  try {
    const container = await waitForElement(selector);
    if (container) {
      container.setAttribute("onclick", metric);
    }
    else {
      console.error(`Элемент ${container} не найден`);
    }
  }
  catch(error) {
    outputErrorMessage("Не удалось инициализировать метрику баннера: ", error);
  }
})();