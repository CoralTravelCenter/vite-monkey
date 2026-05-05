import './style-for-hotel-shild.scss';
import './popover.scss';
import 'tippy.js/dist/tippy.css';
import {ReactDomObserver, waitForDLEvent} from '../../utils.js';
import svgIcon from './icon.html?raw'
import trigger from './trigger.html?raw'
import tippy from "tippy.js";

const HOTEL_CARD_SELECTOR = '#select-room-container';
const BONUS_CONTAINER_SELECTOR = 'div[class*="CoralBonusInformation_coralBonusInformation__"]';
const BONUS_TRIGGER_ID = '#bonus-trigger';
const METRIKA_COUNTER_ID = 96674199;
const METRIKA_GOAL = 'view_hotel_bf25';

const hotelIndex = new Map();

/**
 * Мапа название акции → ссылка
 */
const PROMO_URLS = {
  "Добро пожаловать":
    "https://www.coral.ru/poleznaya-informatsiya/offers/akciya-dobro-pozhalovat/?banner_on_site=cb-dobro-pozhalovat",
  "Сокровища Востока":
    "https://www.coral.ru/poleznaya-informatsiya/offers/aktsiya-sokrovischa-vostoka/?banner_on_site=cb-aktsiya-sokrovischa-vostoka",
  "Первым рейсом":
    "https://www.coral.ru/poleznaya-informatsiya/offers/aktsiya-pervym-rejsom/?banner_on_site=cb-pervym-rejsom",
  "На волне доверия":
    "https://www.coral.ru/poleznaya-informatsiya/offers/aktsiya-na-volne-doveriya/?banner_on_site=cb-akciya-na-volne"
};

/**
 * Приводим промо в удобный формат:
 * [{ "Добро пожаловать": 3000 }] →
 * [{ name: "Добро пожаловать", amount: 3000, url: "..." }]
 */
function normalizePromotions(promotions) {
  if (!Array.isArray(promotions) || promotions.length === 0) return [];

  return promotions
    .map(promoObj => {
      const [name, rawValue] = Object.entries(promoObj || {})[0] || [];
      const amount = Number(rawValue) || 0;

      return {
        name,
        amount,
        url: PROMO_URLS[name] || null,
      };
    })
    .filter(p => p.name && p.amount > 0);
}

/**
 * Форматирование суммы в валюту
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Индекс отелей по id: { [id]: hotel }
 */
function buildHotelIndex(data) {
  if (!Array.isArray(data)) return;

  data.forEach(country => {
    if (!country?.hotels) return;

    country.hotels.forEach(hotel => {
      if (!hotel?.id) return;
      hotelIndex.set(Number(hotel.id), hotel);
    });
  });
}

function findHotelById(id) {
  return hotelIndex.get(Number(id)) || null;
}

/**
 * Считаем общий бонус: 1% от цены + сумма промо
 */
function calcTotalBonus(price, promotions) {
  const numericPrice = Number(price);
  if (!numericPrice || numericPrice <= 0) {
    return formatCurrency(0);
  }

  const onePercent = numericPrice * 0.01;
  const normalizedPromos = normalizePromotions(promotions);

  // нет промо — только 1%
  if (normalizedPromos.length === 0) {
    const onlyPercent = Math.round(onePercent);
    return formatCurrency(onlyPercent);
  }

  // есть промо — суммируем amount
  const promoSum = normalizedPromos.reduce((sum, promo) => {
    return sum + (Number(promo.amount) || 0);
  }, 0);

  const total = Math.round(onePercent + promoSum);
  return formatCurrency(total);
}

/**
 * HTML содержимое тултипа
 */
function buildBonusTooltipHtml(promotions) {
  const normalizedPromos = normalizePromotions(promotions);
  const hasPromos = normalizedPromos.length > 0;

  const rowsHtml = hasPromos
    ? normalizedPromos
      .map(promo => {
        return `
            <div class="row">
              <b>+ ${promo.amount} бонусов</b><a href="${promo.url}" target="_blank" rel="noopener noreferrer" class="bonus-link">по акции «${promo.name}»</a>
            </div>
          `;
      })
      .join('')
    : '';
  return `
    <div id="bonus-tip" class="bonus-tooltip">
      <div class="bonus-content">
        <div class="row">
          <b>1%</b> от стоимости тура на следующее путешествие
        </div>
        ${rowsHtml}
        <p class="note">
          Для начисления бонусов, укажите номер карты в поле «Примечание к заказу»
        </p>
      </div>
    </div>
  `;
}

/**
 * Вставка триггера (кнопка/иконка) внутрь блока бонусов
 */
function insertBonusTrigger(container) {
  if (!container) return;
  const icon = container?.querySelector('.anticon');
  if (icon) icon.innerHTML = svgIcon;
  if (typeof container.insertAdjacentHTML === 'function') {
    container.insertAdjacentHTML('beforeend', trigger)
  }
}

/**
 * Обновление текста с суммой кешбэка
 */
function setBonusValue(container, totalBonus) {
  const spans = container.querySelectorAll('span');
  const priceContainer = spans[2];

  if (!priceContainer) return;

  // totalBonus уже форматированная строка типа "3 000 ₽"
  priceContainer.textContent = `${totalBonus} Кешбэк`;
}

/**
 * Инициализация tippy для триггера
 */
function initBonusTooltip(container, promotions) {
  const triggerEl = container.querySelector(BONUS_TRIGGER_ID);
  if (!triggerEl) return;

  const content = buildBonusTooltipHtml(promotions || []);

  tippy(triggerEl, {
    content,
    allowHTML: true,
    interactive: true,
    trigger: 'click',
    theme: 'bf',
    placement: 'top',
  });
}

/**
 * Основная логика при появлении карточки отеля
 */
async function handleHotelCardAppear(el) {
  const DL = await waitForDLEvent('view_item', 300);
  const item = DL?.ecommerce?.items?.[0];

  if (!item) return;

  const productName = item.item_name;
  const productId = item.item_id;
  const productPrice = item.price;

  if (!productId || !productPrice) return;

  const hotelData = findHotelById(productId);

  if (!hotelData) {
    return;
  }

  ym(METRIKA_COUNTER_ID, 'reachGoal', METRIKA_GOAL, {
    name_hotel: productName,
  });

  el.setAttribute('data-promotion', 'BlackFriday');

  const bonusContainer = el.querySelector(BONUS_CONTAINER_SELECTOR);
  if (!bonusContainer) return;

  insertBonusTrigger(bonusContainer);

  const totalBonus = calcTotalBonus(productPrice, hotelData.promotions);
  setBonusValue(bonusContainer, totalBonus);

  initBonusTooltip(bonusContainer, hotelData.promotions);
}

/**
 * Инициализация
 */
buildHotelIndex(window._blackPromotion || []);

new ReactDomObserver(HOTEL_CARD_SELECTOR, {
  onAppear(el) {
    handleHotelCardAppear(el).catch(console.error);
  },
}).start();
