import {sendMetric} from "./scripts/metric.js";
import {awaitDomElement} from "../../../../utils/index.js";

try {
  (async function promotionMetric() {
    const selector = 'a.promo-card__link[href*="offers-eb-zima2027"]';
    const link = await awaitDomElement(selector);

    if (!link) {
      return;
    }

    function handleClick(event) {
      const targetLink = event.target.closest(selector);
      if (targetLink) {
        sendMetric("promo_page");
      }
    }

    link.addEventListener('click', handleClick);

  })();
}
catch (error) {
  console.error(`Не удалось запустить функцию отправки метрики: ${error}`);
}