import './style.scss';

import {createClientName$} from './scripts/authorization.js';
import {renderPersonalizedContent} from './scripts/content.js';
import {initPopup} from './scripts/popup.js';
import {createTrigger} from "./scripts/createTrigger.js";

async function init() {
  let clientName = '';

  createClientName$().subscribe({
    next(name) {
      clientName = name;
      renderPersonalizedContent(clientName);
    },
    error(error) {
      console.error(
        '[Elite] Ошибка отслеживания авторизации:',
        error
      );
    },
  });

  await initPopup();

  renderPersonalizedContent(clientName);

  const popup = document.getElementById('kapsula-popup-home');
  const triggerBtn = createTrigger(popup);
  const host = document.querySelector('[class*="HeaderMobile_rightGroup__"]');
  if (host) {
    host.appendChild(triggerBtn)
  }
}

init().catch((error) => {
  console.error(
    '[Elite] Не удалось инициализировать popup:',
    error
  );
});
