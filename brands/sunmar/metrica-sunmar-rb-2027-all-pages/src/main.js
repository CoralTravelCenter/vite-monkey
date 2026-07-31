import markup from "./markup.html?raw";
import './style.css';
import { sendMetrica } from "./scripts/metric.js";

async function initWidget() {
  if (typeof hostReactAppReady === 'function') {
    try {
      await hostReactAppReady();
    } catch(e) {
      console.error(`Ошибка хоста: ${e}`);
    }

    const devContainer = document.getElementById('monkey-app');

    if (devContainer && !devContainer.dataset.injected) {
      devContainer.innerHTML = markup;
      devContainer.dataset.injected = 'true';
      sendMetrica(devContainer);
    }
  }
}

async function onProdContainer() {
  if (typeof hostReactAppReady === 'function') {
    try {
      await hostReactAppReady();
    } catch(e) {
      console.error(`Ошибка хоста: ${e}`);
    }
  }

  const obs = new MutationObserver(() => {
    const hotelsBlock = document.querySelector('[data-v-app]');
    const hotDealsBlock = document.querySelector('.hot-deals-block');
    const customBlock = document.querySelector('#seo-block-place');
    const siblingMenu = document.querySelectorAll('.sibling-menu');

    if (document.querySelector('.custom-injected-widget-wrapper')) {
      obs.disconnect();
      return;
    }

    if (!hotelsBlock && !hotDealsBlock && !customBlock) {
      return;
    }

    const bannerBlock = document.createElement('div');
    bannerBlock.className = 'custom-injected-widget-wrapper';

    if (siblingMenu.length > 0) {
      bannerBlock.classList.add('seo-banner--with-menu');
    }

    bannerBlock.innerHTML = markup;
    let inserted = false;

    if (hotelsBlock?.parentElement) {
      hotelsBlock.parentElement.insertAdjacentElement('afterbegin', bannerBlock);
      inserted = true;
    } else if (hotDealsBlock) {
      hotDealsBlock.insertAdjacentElement('beforebegin', bannerBlock);
      inserted = true;
    } else if (customBlock) {
      customBlock.insertAdjacentElement('afterbegin', bannerBlock);
      inserted = true;
    }

    if (inserted) {
      sendMetrica(bannerBlock);
      obs.disconnect();
    }
  });

  obs.observe(document, {
    childList: true,
    subtree: true,
  });
}

(async function startBanner() {
  if (!import.meta.env.DEV) {
    try {
      await onProdContainer();
    } catch(e) {
      console.error(`Ошибка запуска функции внедрения баннера: ${e}`);
    }
  } else {
    try {
      await initWidget();
    } catch(e) {
      console.error(`Ошибка запуска функции внедрения баннера: ${e}`);
    }
  }
})();