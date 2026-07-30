import markup from "./markup.html?raw";
import './style.css';
import { sendMetrica } from "./scripts/metric.js";

function hostReactAppReady(selector = '#__next > div', timeout = 500) {
  return new Promise(resolve => {
    const waiter = () => {
      const host_el = document.querySelector(selector);
      if (host_el?.getBoundingClientRect().height) {
        resolve();
      } else {
        setTimeout(waiter, timeout);
      }
    };
    waiter();
  });
}

hostReactAppReady().then(() => {
  if (import.meta.env.DEV) {
    const devContainer = document.querySelector('[id^="widget-"]') || document.getElementById('monkey-app');
    if (devContainer && !devContainer.dataset.injected) {
      devContainer.innerHTML = markup;
      devContainer.dataset.injected = 'true';
      sendMetrica();
    }
    return;
  }

  const obs = new MutationObserver(() => {
    const hotelsBlock = document.querySelector('[data-v-app]');
    const hotDealsBlock = document.querySelector('.hot-deals-block');
    const customBlock = document.querySelector('#seo-block-place');

    let inserted = false;

    if (hotelsBlock?.parentElement) {
      const hotelsParent = hotelsBlock.parentElement;
      hotelsParent.insertAdjacentHTML('afterbegin', markup);
      inserted = true;
      obs.disconnect();
    } else if (hotDealsBlock) {
      hotDealsBlock.insertAdjacentHTML('beforebegin', markup);
      inserted = true;
      obs.disconnect();
    } else if (!hotDealsBlock && !hotelsBlock && customBlock) {
      customBlock.insertAdjacentHTML('afterbegin', markup);
      inserted = true;
      obs.disconnect();
    } else if (hotDealsBlock && hotelsBlock && customBlock) {
      customBlock.insertAdjacentHTML('afterbegin', markup);
      inserted = true;
      obs.disconnect();
    }

    if (inserted) {
      sendMetrica();
    }
  });

  obs.observe(document, {
    childList: true,
    subtree: true,
  });
});