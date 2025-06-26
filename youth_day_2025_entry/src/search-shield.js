import {insertOnce, ReactDomObserver} from "../../utils.js";
import shield from './search-shield/shield.html?raw';
import './search-shield/shield.css';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function insertShield(el) {
  let cards = null;
  if (!isMobile) {
    cards = el.querySelectorAll('.hotel-card');
  } else {
    cards = el.querySelectorAll('.hotel-card-price');
  }
  console.log(cards);
  cards.forEach(card => insertOnce(card, 'beforeend', shield));
}

const observer = new ReactDomObserver('[data-testid="virtuoso-item-list"]', {
  watchAttributes: true,
  attributeFilter: ['style'],
  onAppear: (el) => {
    insertShield(el)
  },
  onAttributeMutation: (el) => {
    insertShield(el)
  }
})
observer.start()
