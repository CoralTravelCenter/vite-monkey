import './style.css'
import {ReactDomObserver} from "../../utils.js";

const badge_text = 'Скидка на отдых до 12500₽';
const badge_erid = 'Реклама. ООО «Центрбронь» erid: 2W5zFFxsBRj';

const badgeTemplate = createBadge();

function createBadge() {
  const badge = document.createElement('div');
  badge.className = 'custom-promo-badge';
  badge.innerHTML = `
    <span class="custom-promo-badge__text">${badge_text}</span>
    <span class="custom-promo-badge__erid">${badge_erid}</span>
  `;
  return badge;
}

function setBadge(host) {
  const cards = host.querySelectorAll('div[class*="HotelCardPrice_hotelCardPriceContainer"]');

  cards.forEach((item) => {
    if (item.querySelector('.custom-promo-badge')) return;
    item.append(badgeTemplate.cloneNode(true));
  });
}

new ReactDomObserver('[data-testid="virtuoso-item-list"]', {
  watchChild: true,
  onAppear: (el) => {
    setBadge(el)
  },
  onChildMutate: (el) => {
    setBadge(el)
  }
}).start()
