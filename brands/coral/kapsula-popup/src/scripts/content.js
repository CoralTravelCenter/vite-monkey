import {PERSONALIZED_CONTENT_SELECTOR} from './constants.js';

const DESCRIPTION = 'Соберите идеальное путешествие\nпод ваш неповторимый стиль.';

function createTextElement(tagName, text) {
  const element = document.createElement(tagName);
  element.textContent = text;

  return element;
}

export function renderPersonalizedContent(clientName = '') {
  const normalizedName = String(clientName).trim();

  document
    .querySelectorAll(PERSONALIZED_CONTENT_SELECTOR)
    .forEach((element) => {
      const nodes = [];

      if (normalizedName) {
        nodes.push(
          createTextElement('h3', `${normalizedName},`)
        );
      }

      const description = normalizedName
        ? `с${DESCRIPTION.slice(1)}`
        : DESCRIPTION;

      nodes.push(createTextElement('p', description));

      element.replaceChildren(...nodes);
    });
}
