import './style.scss';

import {createClientName$} from './scripts/authorization.js';
import {renderPersonalizedContent} from './scripts/content.js';
import {initPopup} from './scripts/popup.js';

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
}

init().catch((error) => {
  console.error(
    '[Elite] Не удалось инициализировать popup:',
    error
  );
});
