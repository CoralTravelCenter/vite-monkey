import {formatCurrency} from "../utils/format-currency.js";


const STYLE_ATTRIBUTE = 'data-chain-cb-hot-deal-styles';


function createHotelSelector(hotelName) {
  return `[alt=${JSON.stringify(hotelName)} i]`;
}


export function applyHotelBadgeStyles({hotels, value}) {
  document.querySelector(`style[${STYLE_ATTRIBUTE}]`)?.remove();

  if (!Array.isArray(hotels) || hotels.length === 0) {
    return;
  }

  const imageSelectors = hotels
    .filter((hotelName) => typeof hotelName === 'string' && hotelName.trim())
    .map(createHotelSelector)
    .join(',');

  if (!imageSelectors) {
    return;
  }

  const style = document.createElement('style');
  style.setAttribute(STYLE_ATTRIBUTE, '');
  style.textContent = `
    .hot-deals-block .hotel-showcase:has(img:is(${imageSelectors})) {
      --chain-cb-hot-deal-badge-display: flex;
      --chain-cb-hot-deal-badge-text: ${JSON.stringify(`Дешевле на ${formatCurrency(value)} с CoralBonus`)};
    }
  `;

  (document.head ?? document.documentElement).append(style);
}
