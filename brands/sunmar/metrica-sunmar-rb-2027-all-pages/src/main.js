import markup from "./markup.html?raw";
import './style.css';
import {sendMetrica} from "./scripts/metric.js";

if (import.meta.env.DEV) {
  async function initWidget() {
    if (typeof hostReactAppReady === 'function') {
      await hostReactAppReady();
      const devContainer = document.getElementById('monkey-app');

      if (devContainer && !devContainer.dataset.injected) {
        devContainer.innerHTML = markup;
        devContainer.dataset.injected = 'true';
        sendMetrica();
        return;
      }
      console.error('Failed to load monkey-app');
    }
  }

  initWidget();
}

function onProdContainer() {
  const prodContainer = document.getElementById('metrica-sunmar-rb-2027-all-pages');

  if (prodContainer && !prodContainer.dataset.injected) {
    prodContainer.innerHTML = markup;
    prodContainer.dataset.injected = 'true';
    sendMetrica();
  }
}

if (!import.meta.env.DEV) {
  onProdContainer();
}