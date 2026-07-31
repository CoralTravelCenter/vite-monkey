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

  function handleClick(event) {
    const link = event.target.closest(selector);
    if (link) {
      sendMetric("promo_page");
    }
  }

  const existingLink = document.querySelector(selector);
  if (existingLink) {
    existingLink.addEventListener('click', handleClick);
    return;
  }

  const observer = new MutationObserver((mutations, obs) => {
    try {
      const link = document.querySelector(selector);
      if (link) {
        link.addEventListener('click', handleClick);
        obs.disconnect();
      }
    } catch (err) {
      console.error("Ошибка отслеживания элемента:", err);
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
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
    console.error(`Не удалось запустить функцию отправку метрики: ${error}`);
  }
})();