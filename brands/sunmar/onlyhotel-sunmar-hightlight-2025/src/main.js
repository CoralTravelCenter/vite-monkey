import markup from './markup.html?raw';
import './style.css';

document.body.insertAdjacentHTML("beforeend", markup);
const promoTrigger = document.querySelector("#promo-trigger");
const closeTrigger = document.querySelector('#promo-trigger-close');
closeTrigger.addEventListener('click', () => {
  promoTrigger.classList.add('js-close');
})
