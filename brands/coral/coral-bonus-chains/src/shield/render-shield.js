import {formatCurrency} from "../utils/format-currency.js";
import {ROUTES} from "../constants.js";


function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}


function createHotelContent(value) {
  const text = createElement('span', 'chain-cb__hotel-text', 'Дешевле на ');
  const valueNode = createElement(
    'strong',
    'chain-cb__value',
    formatCurrency(value)
  );

  text.append(
    valueNode,
    document.createElement('br'),
    ' с CoralBonus'
  );

  return [text];
}


function createBookingContent(value) {
  const content = createElement('span', 'chain-cb__booking-content', '');
  const title = createElement(
    'strong',
    'chain-cb__title',
    `Доступна скидка ${Number(value).toLocaleString('ru-RU')} бонусов по акции CoralBonus`
  );
  const description = createElement(
    'span',
    'chain-cb__description',
    'Укажите карту в комментариях к заказу'
  );
  const details = createElement('span', 'chain-cb__details', 'Подробнее');

  content.append(title, description);

  return [content, details];
}


function createShield(value, url, route) {
  const shield = document.createElement('a');
  shield.href = url;
  shield.target = '_blank';
  shield.rel = 'noopener noreferrer';
  shield.id = 'chainCB';
  shield.dataset.chainCbShield = '';
  shield.dataset.page = route;
  shield.onClick = () => {
    ym(96674199, 'reachGoal', 'coral_bonus_tooltip_click')
  }

  const content = route === ROUTES.BOOKING_STEP_0
    ? createBookingContent(value)
    : createHotelContent(value);

  shield.append(...content);
  return shield;
}


export function renderShield(host, route) {
  const currentShield = document.querySelector('[data-chain-cb-shield]');
  const shield = currentShield?.dataset.page === route
    ? currentShield
    : createShield(
      window._coralBonusChains.value,
      window._coralBonusChains.url,
      route
    );


  currentShield?.remove();
  host.prepend(shield);
}
