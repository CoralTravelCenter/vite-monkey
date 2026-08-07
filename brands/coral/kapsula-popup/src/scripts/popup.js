import {reactDomObserver} from '../../../../../utils/index.js';

import markup from '../markup.html?raw';
import popupMarkup from '../popup.html?raw';

import {
  HEADER_SELECTOR,
  POPUP_SELECTOR,
  POPUP_TRIGGER_SELECTOR,
} from './constants.js';
import {
  sendCapsulaClickMetric,
  sendLearnMoreMetric,
  sendPopupOpenMetric,
} from './metrics.js';

const SHADOW_CLOSE_SELECTOR = [
  '[part~="close-button"]',
  '[part~="popup-close"]',
  '[part~="close"]',
  'button[aria-label="Закрыть"]',
  'button[aria-label="Close"]',
  '[data-close]',
  '.close',
].join(', ');

function bindShadowCloseMetric(popup) {
  const closeButton = popup?.shadowRoot?.querySelector(
    SHADOW_CLOSE_SELECTOR
  );

  if (!closeButton) {
    console.warn('[Elite] Кнопка закрытия popup не найдена');
    return;
  }

  closeButton.addEventListener('click', () => {
    sendCapsulaClickMetric('close');
  });
}

function observePopupTrigger() {
  reactDomObserver()
    .observeSelector$(HEADER_SELECTOR, {
      emitRemove: false,
    })
    .subscribe(({element: header}) => {
      if (document.querySelector(POPUP_TRIGGER_SELECTOR)) {
        return;
      }

      header.insertAdjacentHTML('afterend', markup);
    });
}

async function mountPopup() {
  await customElements.whenDefined('coral-popup');

  let popup = document.querySelector(POPUP_SELECTOR);

  if (!popup) {
    document.body.insertAdjacentHTML('beforeend', popupMarkup);
    popup = document.querySelector(POPUP_SELECTOR);
  }

  return popup;
}

function bindPopupInteractions() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const learnMoreLink = event.target.closest(
      `${POPUP_SELECTOR} .learn-more`
    );

    if (learnMoreLink) {
      sendLearnMoreMetric();
      return;
    }

    const popupTrigger = event.target.closest(
      POPUP_TRIGGER_SELECTOR
    );

    if (popupTrigger) {
      sendPopupOpenMetric();
      document.querySelector(POPUP_SELECTOR)?.show();
      return;
    }

    const noThanksButton = event.target.closest(
      `${POPUP_SELECTOR} .close-btn`
    );

    if (!noThanksButton) {
      return;
    }

    sendCapsulaClickMetric('no_thanks');
    noThanksButton.closest(POPUP_SELECTOR)?.hide();
  });
}

export async function initPopup() {
  observePopupTrigger();
  bindPopupInteractions();

  const popup = await mountPopup();

  bindShadowCloseMetric(popup);
}
