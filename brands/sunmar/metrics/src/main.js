import {sendMetric} from "./scripts/metric.js";

async function promotionMetric() {
  if (typeof hostReactAppReady !== 'function') {
    console.error("Приложение не найдено!");
    return;
  }

  try {
    await hostReactAppReady();
  } catch (err) {
    throw new Error(`Ошибка инициализации хоста: ${err.message}`);
  }

  const selector = 'a.promo-card__link[href*="offers-eb-zima2027"]';

  if (document.querySelector(selector)) {
    sendMetric("promo_page");
    return;
  }

  const targetNode = document.body;
  let isSent = false;

  const observer = new MutationObserver((mutations, obs) => {
    if (isSent) return;

    try {
      if (document.querySelector(selector)) {
        isSent = true;
        sendMetric("promo_page");
        obs.disconnect();
      }
    } catch (err) {
      console.error("Ошибка в MutationObserver:", err);
      obs.disconnect();
    }
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true,
    attributes: true,
  });
}

(async function startMetric() {
  try {
    await promotionMetric();
  }
  catch (error) {
    console.error(`Не удалось запустить отправку метрики: ${error}`);
  }
})();