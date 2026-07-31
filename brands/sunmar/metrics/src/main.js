import {sendMetric} from "./scripts/metric.js";

async function promotionMetric() {
  if (typeof hostReactAppReady === 'function') {
    await hostReactAppReady();
    const selector = 'a.promo-card__link[href*="offers-eb-zima2027"]';

    if (document.querySelector(selector)) {
      sendMetric("promo_page");
      return;
    }
    else {
      console.error("Ошибка при отправке метрики");
    }

    const targetNode = document.body;
    let isSent = false;

    const observer = new MutationObserver((mutations) => {
      if (isSent) return;

      if (document.querySelector(selector)) {
        isSent = true;
        sendMetric("promo_page");
        observer.disconnect();
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }
  else {
    console.error("Приложение не найдено!");
  }
}

(async function startMetric() {
  await promotionMetric();
})();