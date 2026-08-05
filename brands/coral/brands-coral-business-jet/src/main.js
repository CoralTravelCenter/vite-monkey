import markup from './markup.html?raw';
import './style.css'

const selector = '[data-jet-insert]';
// eslint-disable-next-line no-undef
const container = document.querySelector(selector);

if (container && !container.dataset.injected) {
  container.insertAdjacentHTML('afterbegin', markup);
  container.dataset.injected = 'true';
}
