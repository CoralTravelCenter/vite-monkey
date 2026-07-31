import markup from "./markup.html?raw";
import './style.css';
import { sendMetrica } from "./scripts/metric.js";

const TARGET_INDICES = [3];

function injectProd() {
  const containers = document.querySelectorAll('#section-column-1');

  let activeContainer = null;
  let targetWidgets = null;

  for (const container of containers) {
    const widgets = container.querySelectorAll('[data-widget-type="1"]');
    if (widgets.length > 0) {
      activeContainer = container;
      targetWidgets = widgets;
      break;
    }
  }

  if (!activeContainer || !targetWidgets) return;

  TARGET_INDICES.forEach(index => {
    if (targetWidgets.length > index) {
      const targetWidget = targetWidgets[index];

      const nextSibling = targetWidget.nextElementSibling;
      if (nextSibling && nextSibling.classList.contains('custom-injected-widget-wrapper')) {
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'custom-injected-widget-wrapper';
      wrapper.innerHTML = markup;

      targetWidget.after(wrapper);

      sendMetrica(wrapper);
    }
  });
}

async function onProdContainer() {
  if (typeof hostReactAppReady === 'function') {
    try {
      await hostReactAppReady();
    } catch(e) {
      console.warn("Ошибка hostReactAppReady:", e);
    }
  }

  injectProd();

  const observer = new MutationObserver(() => {
    injectProd();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}

onProdContainer();