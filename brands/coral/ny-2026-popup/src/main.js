import markup from './markup.html?raw';
import markupTrigger from './trigger.html?raw';
import './style.css';

document.body.insertAdjacentHTML('beforeend', markup)
document.body.insertAdjacentHTML('beforeend', markupTrigger)

const trigger = document.querySelector('#ny-26-trigger');
const popup = document.querySelector('#ny-2026-popup');
if (trigger && popup) {
  trigger.addEventListener('click', () => {
    popup.show()
  })
}
