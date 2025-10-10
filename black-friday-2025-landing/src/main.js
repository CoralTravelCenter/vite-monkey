import kv from './markup/kv.html?raw';
import text from './markup/text.html?raw';
import plate from './markup/plate.html?raw';
import contacts from './markup/contacts.html?raw';
import './style.css';
import {hostReactAppReady} from "../../utils.js";

const markup = kv + text + plate + contacts;
document.querySelector('#monkey-app').insertAdjacentHTML('afterbegin', markup)

window._toursByCountry = [
  {
    country: "Турция",
    hotels: [
      {
        hotel: "RAFFLES ISTANBUL",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Турция, Стамбул, Зорлу / Beşiktaş",
        meal: "Deluxe Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "RADISSON BLU HOTEL, ISTANBUL SISLI",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Турция, Стамбул, Şişli",
        meal: "Superior Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "MALL OF ISTANBUL HOTEL",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Турция, Стамбул, Başakşehir",
        meal: "Standard Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "AKRA HOTEL ANTALYA",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Турция, Анталья, Муратпаша",
        meal: "Deluxe Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      }
    ]
  },
  {
    country: "ОАЭ",
    hotels: [
      {
        hotel: "ADDRESS DOWNTOWN",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "ОАЭ, Дубай, Downtown",
        meal: "Deluxe Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "ROVE DOWNTOWN DUBAI",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 4,
        location: "ОАЭ, Дубай, Downtown",
        meal: "Rover Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "KEMPINSKI HOTEL MALL OF THE EMIRATES",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "ОАЭ, Дубай, Al Barsha",
        meal: "Superior Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "CROWNE PLAZA DUBAI MARINA",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "ОАЭ, Дубай, Dubai Marina",
        meal: "Standard City View, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      }
    ]
  },
  {
    country: "Египет",
    hotels: [
      {
        hotel: "STEIGENBERGER AQUA MAGIC",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Египет, Хургада",
        meal: "Superior Room, Все включено",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "JAZ AQUAMARINE RESORT",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Египет, Хургада",
        meal: "Superior Room, Все включено",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "SAVOY SHARM EL SHEIKH",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Египет, Шарм-эш-Шейх, Soho Square",
        meal: "Standard Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "SIERRA SHARM EL SHEIKH",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Египет, Шарм-эш-Шейх, Soho Square",
        meal: "Standard Room, Все включено",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      }
    ]
  },
  {
    country: "Таиланд",
    hotels: [
      {
        hotel: "CENTARA GRAND AT CENTRALWORLD",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Таиланд, Бангкок, Ratchaprasong",
        meal: "Superior Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "NOVOTEL BANGKOK ON SIAM SQUARE",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 4,
        location: "Таиланд, Бангкок, Siam",
        meal: "Superior Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "HOLIDAY INN RESORT PHUKET (PATONG)",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Таиланд, Пхукет, Патонг",
        meal: "Superior Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      },
      {
        hotel: "HOLIDAY INN PATTAYA",
        dates: ["2025-10-13", "2025-10-31"],
        rating: 5,
        location: "Таиланд, Паттайя",
        meal: "Ocean View Room, Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "из Москвы",
        package: "Перелет включен",
        urls: ["#", "#"]
      }
    ]
  }
];

/* ===========================
 *  СЕТЕВОЙ СЛОЙ (DOM-нечувствительный)
 * =========================== */
const ENDPOINTS = {
  listArrivalLocations: '/endpoints/PackageTourHotelProduct/ListArrivalLocations',
  listAvailableDates: '/endpoints/PackageTourHotelProduct/ListAvailableDates',
  listAvailableNights: '/endpoints/PackageTourHotelProduct/ListAvailableNights',
  priceSearchList: '/endpoints/PackageTourHotelProduct/PriceSearchList',
};

const MOSCOW_DEPARTURE = {
  id: '2671-5',
  name: 'Москва',
  type: 5,
  friendlyUrl: 'moskva'
};

async function fetchJSON(url, body, method = 'POST') {
  const res = await fetch(url, {
    method,
    headers: {'Content-Type': 'application/json;charset=utf-8'},
    body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function fetchArrivalLocations(searchTexts) {
  const results = await Promise.all(
    searchTexts.map(text =>
      fetchJSON(ENDPOINTS.listArrivalLocations, {departureLocations: [MOSCOW_DEPARTURE], text})
    )
  );
  const wanted = new Set(searchTexts.map(s => s.trim().toUpperCase()).filter(Boolean));
  const byId = new Map();
  for (const r of results) {
    const locations = r?.result?.locations ?? [];
    for (const loc of locations) {
      const nameU = (loc.name || '').trim().toUpperCase();
      if (wanted.has(nameU)) byId.set(loc.id, loc);
    }
  }
  return [...byId.values()];
}

async function fetchAvailableDates(arrivalLocation) {
  return fetchJSON(ENDPOINTS.listAvailableDates, {
    departureLocations: [MOSCOW_DEPARTURE],
    arrivalLocations: [arrivalLocation],
  });
}

function fetchAvailableNights(arrivalLocation, beginDate) {
  return fetchJSON(ENDPOINTS.listAvailableNights, {
    flightType: 2,
    beginDates: [beginDate],
    calculateAvailableNightRanges: true,
    departureLocations: [MOSCOW_DEPARTURE],
    arrivalLocations: [arrivalLocation],
  });
}

function fetchPrices(arrivalLocation, beginDate, nightsValue) {
  return fetchJSON(ENDPOINTS.priceSearchList, {
    searchSource: 0,
    searchCriterias: {
      flightType: 2,
      reservationType: 1,
      beginDates: [beginDate],
      datePickerMode: 0,
      nights: [{value: nightsValue}],
      roomCriterias: [{passengers: [{age: 20, passengerType: 0}, {age: 20, passengerType: 0}]}],
      departureLocations: [MOSCOW_DEPARTURE],
      arrivalLocations: [arrivalLocation],
      paging: {pageNumber: 1, pageSize: 20, sortType: 0},
      imageSizes: [4],
      categories: [],
      additionalFilters: [],
    },
  });
}

/* ===========================
 *  УТИЛИТЫ
 * =========================== */
const YM_ID = 96674199;
const MAX_DATES_PER_HOTEL = 6;

function toDate(d) {
  const [y, m, dd] = String(d).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, dd));
}

function inRange(d, start, end) {
  const t = toDate(d).getTime();
  return t >= toDate(start).getTime() && t <= toDate(end).getTime();
}

function filterDatesInRange(apiDates, start, end) {
  return (apiDates || []).map(x => x.date).filter(d => inRange(d, start, end));
}

function findByField(arr, key, value) {
  if (!Array.isArray(arr)) return null;
  return arr.find(it => it && it[key] === value) || null;
}

function formatPrice(num) {
  const formatted = new Intl.NumberFormat('ru-RU').format(num ?? 0);
  return formatted.split(',')[0];
}

/* =================================================================
 *  ВСЁ, ЧТО ВЗАИМОДЕЙСТВУЕТ С DOM
 * ================================================================= */
;(async () => {
  await hostReactAppReady();

  const SEL = {
    navButtons: '.tabs-nav [data-tab-button]',
    panels: '.tab-content[data-tab-content]',
    activeClass: 'js-active',
    cardsContainer: '.cards-container',
    loadingBox: '.loading-box',
  };

  const $ = (r, s) => r.querySelector(s);
  const $all = (r, s) => Array.from(r.querySelectorAll(s));

  function ensureCardsContainer(panelEl) {
    let box = $(panelEl, SEL.cardsContainer);
    if (!box) {
      box = document.createElement('div');
      box.className = 'cards-container';
      panelEl.appendChild(box);
    }
    return box;
  }

  function ensureLoadingBox(panelEl) {
    let box = $(panelEl, SEL.loadingBox);
    if (!box) {
      box = document.createElement('div');
      box.className = 'loading-box';
      box.style.display = 'none';
      panelEl.insertBefore(box, panelEl.firstChild);
    }
    return box;
  }

  /* ===========================
   *  КНОПКА + ДИАПАЗОН ДАТ (coral-button)
   * =========================== */
  function buildRangeAndPriceButton(data) {
    const btn = document.createElement('coral-button');
    btn.setAttribute('trait', 'vivid');
    btn.setAttribute('shape', 'pill');
    btn.setAttribute('style', '--roundness: 8px');
    btn.innerHTML = `<a href="${data.url || '#'}">${data.displayPricePerNight ? `от ${data.displayPricePerNight} ₽ /<small>за ночь</small>` : 'Кнопка'}</a>`;

    return {priceButton: btn};
  }

  /* ===========================
   * ИКОНКИ (как в макете)
   * =========================== */
  function createInfoIcons(data) {
    const info = document.createElement('div');
    info.className = 'info-icons';
    info.innerHTML = `
    <div class="icon-wrapper">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M1.333 6.667a2 2 0 0 1 2-2h9.334a2 2 0 0 1 2 2V8H1.333zm0 1.333h13.334v3H13л-1-1.333H4L3 11H1.333zM2 2.667a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2H2z"
                stroke="#535353" stroke-width=".7" stroke-linejoin="round"/>
        </svg>
      </div>
      ${data.nights || 7} н
    </div>

    <div class="icon-wrapper">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
          <path d="M4.892 5.983a2.47 2.47 0 0 1 0-4.941"
                stroke="#535353" stroke-width=".8" stroke-linejoin="bevel"/>
          <path d="M.5 10.375a4.39 4.39 0 0 1 4.392-4.392"
                stroke="#535353" stroke-width=".8" stroke-linejoin="bevel"/>
          <circle cx="8.833" cy="3.667" r="2.625"
                  stroke="#535353" stroke-width=".8" stroke-linejoin="bevel"/>
          <path d="M4.167 10.958a4.667 4.667 0 1 1 9.333 0"
                stroke="#535353" stroke-width=".8" stroke-linejoin="bevel"/>
        </svg>
      </div>
      ${data.passengers || 'на двоих'}
    </div>

    <div class="icon-wrapper">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="m3.558 2.845-1.88.684 2.82 2.875 7.518-2.736a1 1 0 1 0-.684-1.88L9.05 2.62 7.01.914л-2.42.172 1.64 2.56-1.32.48zM.333 9.333h13.334"
                stroke="#535353" stroke-width=".8" stroke-linejoin="round"/>
        </svg>
      </div>
      ${data.departure || 'из Москвы'}
    </div>
  `;
    return info;
  }


  /* ===========================
   *  КАРТОЧКА
   * =========================== */
  function buildHotelCard(data) {
    const root = document.createElement('div');
    root.className = 'hotel-card';
    root.setAttribute('data-hotel', data.hotel);

    const visualWrap = document.createElement('div');
    visualWrap.className = 'visual';
    const img = document.createElement('img');
    img.src = data.visual || '';
    img.alt = data.hotel;
    visualWrap.append(img);

    const content = document.createElement('div');
    content.className = 'content';

    const top = document.createElement('div');
    top.className = 'top';
    top.innerHTML = `
      <div class="hotel-location">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
          <path d="M12.8335 5.66683C12.8335 9.72673 8.50008 14.6668 8.50008 14.6668C8.50008 14.6668 4.16675 9.72673 4.16675 5.66683C4.16675 3.2736 6.10685 1.3335 8.50008 1.3335C10.8934 1.3335 12.8335 3.2736 12.8335 5.66683Z" stroke="#535353" stroke-width="0.5" stroke-linejoin="round"/>
          <path d="M8.5 7.66699C9.60457 7.66699 10.5 6.77156 10.5 5.66699C10.5 4.56242 9.60457 3.66699 8.5 3.66699C7.39543 3.66699 6.5 4.56242 6.5 5.66699C6.5 6.77156 7.39543 7.66699 8.5 7.66699Z" stroke="#535353" stroke-width="0.5" stroke-linejoin="round"/>
        </svg>
        ${data.location}
      </div>
      <div class="hotel-name">${data.hotel}</div>
      <div class="rating">${`<span class="star"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M15.0733 5.16238L10.5394 4.50345L8.5126 0.394524C8.45725 0.282024 8.36618 0.190952 8.25367 0.135595C7.97153 -0.00369038 7.62867 0.112381 7.4876 0.394524L5.46082 4.50345L0.926889 5.16238C0.801889 5.18024 0.687603 5.23917 0.600103 5.32845C0.494321 5.43718 0.43603 5.58345 0.438039 5.73514C0.440048 5.88682 0.502192 6.0315 0.610817 6.13738L3.89117 9.3356L3.11617 13.8517C3.098 13.9567 3.10963 14.0648 3.14973 14.1635C3.18984 14.2623 3.25682 14.3479 3.34308 14.4106C3.42935 14.4732 3.53144 14.5104 3.63778 14.518C3.74413 14.5256 3.85047 14.5032 3.94475 14.4535L8.0001 12.3213L12.0555 14.4535C12.1662 14.5124 12.2947 14.532 12.418 14.5106C12.7287 14.457 12.9376 14.1624 12.884 13.8517L12.109 9.3356L15.3894 6.13738C15.4787 6.04988 15.5376 5.9356 15.5555 5.8106C15.6037 5.4981 15.3858 5.20881 15.0733 5.16238Z" fill="#FADB14"/>
</svg></span>`.repeat(data.rating || 0)}</div>
    `;

    const mealEl = document.createElement('div');
    mealEl.className = 'meal';
    mealEl.textContent = data.meal || '';

    const {priceButton} = buildRangeAndPriceButton(data);
    const infoIcons = createInfoIcons(data);

    const packageEl = document.createElement('div');
    packageEl.className = 'package';
    packageEl.textContent = data.package || '';

    content.append(top, mealEl, infoIcons, packageEl, priceButton);
    root.append(visualWrap, content);

    priceButton.addEventListener('click', (ev) => {
      // клик по coral-button — найдём вложенную ссылку
      const link = priceButton.querySelector('a');
      if (link) {
        ev.preventDefault();
        ym(YM_ID, 'reachGoal', 'select-tour-page-podborka', {hotel: data.hotel});
        window.open(link.href, '_blank');
      }
    });

    return root;
  }

  /* ===========================
   *  ЗАГРУЗКА ДАННЫХ В ТАБУ
   * =========================== */
  async function loadTabDataIntoPanel(panelEl, tabConfig, cacheKey) {
    const loadingBox = ensureLoadingBox(panelEl);
    const cardsBox = ensureCardsContainer(panelEl);

    cardsBox.innerHTML = '';
    loadingBox.style.display = 'block';

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      JSON.parse(cached).forEach(h => cardsBox.appendChild(buildHotelCard(h)));
      loadingBox.style.display = 'none';
      return;
    }

    const hotels = tabConfig.hotels || [];
    const hotelNames = hotels.map(h => h.hotel);
    const arrivalLocations = await fetchArrivalLocations(hotelNames);

    const byName = new Map();
    for (const a of arrivalLocations) byName.set((a.name || '').trim().toUpperCase(), a);

    const collected = [];

    for (const hotel of hotels) {
      const arrival = byName.get((hotel.hotel || '').trim().toUpperCase());
      if (!arrival) continue;

      const [startDate, endDate] = hotel.dates || [];
      const datesResp = await fetchAvailableDates(arrival);
      const apiDates = datesResp?.result?.dates ?? [];
      const datesInRange = filterDatesInRange(apiDates, startDate, endDate).slice(0, MAX_DATES_PER_HOTEL);
      if (!datesInRange.length) continue;

      const prices = [];
      let visualUrl = null;

      for (const begin of datesInRange) {
        const nightsResp = await fetchAvailableNights(arrival, begin);
        const nightsList = nightsResp?.result?.nights ?? [];
        const preferred = hotel.nights ? findByField(nightsList, 'value', hotel.nights) : null;
        const selectedNights = preferred?.value || (nightsList[0]?.value);
        if (!selectedNights) continue;

        const priceResp = await fetchPrices(arrival, begin, selectedNights);
        const firstProduct = priceResp?.result?.products?.[0];
        const amount = firstProduct?.offers?.[0]?.price?.amount;
        const imgUrl = firstProduct?.hotel?.images?.[4]?.sizes?.[0]?.url;

        if (amount) prices.push({date: begin, amount});
        if (!visualUrl && imgUrl) visualUrl = imgUrl;
      }

      // Сервер отдаёт самую доступную цену — берём минимум из собранных и считаем «за ночь/на человека»
      const baseAmount = prices.length ? Math.min(...prices.map(p => p.amount)) : null;
      const perNightPerPerson = baseAmount != null ? Math.round(baseAmount / 7 / 2) : null;
      const displayPricePerNight = perNightPerPerson != null ? formatPrice(perNightPerPerson) : '';

      const renderModel = {
        ...hotel,
        datesRange: [hotel.dates?.[0], hotel.dates?.[1]], // ДД.ММ — ДД.ММ
        price: prices,                                     // оставим для отладки/расширений
        displayPricePerNight,
        url: hotel.urls?.[0] || '#',
        visual: visualUrl || hotel.visual || '',
      };

      collected.push(renderModel);
      cardsBox.appendChild(buildHotelCard(renderModel));
    }

    sessionStorage.setItem(cacheKey, JSON.stringify(collected));
    loadingBox.style.display = 'none';
  }

  /* ===========================
   *  ИНИЦИАЛИЗАЦИЯ И ПЕРЕКЛЮЧЕНИЕ ТАБОВ
   * =========================== */
  (function initTabsBinding() {
    const buttons = $all(document, SEL.navButtons);
    const panels = $all(document, SEL.panels);
    if (!buttons.length || !panels.length) return;

    function activateByCountry(country) {
      const btn = buttons.find(b => (b.getAttribute('data-tab-button') || '').trim() === country.trim());
      const panel = panels.find(p => (p.getAttribute('data-tab-content') || '').trim() === country.trim());
      if (!btn || !panel) return null;

      buttons.forEach(b => b.classList.remove(SEL.activeClass));
      panels.forEach(p => p.classList.remove(SEL.activeClass));
      btn.classList.add(SEL.activeClass);
      panel.classList.add(SEL.activeClass);
      return panel;
    }

    function cfgIndexByCountry(country) {
      return (window._toursByCountry || []).findIndex(c => (c.country || '').trim() === country.trim());
    }

    // Активная по DOM (или первая)
    const initialBtn = buttons.find(b => b.classList.contains(SEL.activeClass)) || buttons[0];
    if (!initialBtn) return;
    const initialCountry = initialBtn.getAttribute('data-tab-button').trim();
    const initialPanel = activateByCountry(initialCountry);

    // Первая загрузка
    const i = cfgIndexByCountry(initialCountry);
    if (i >= 0 && initialPanel) {
      loadTabDataIntoPanel(initialPanel, window._toursByCountry[i], `hotelData_${initialCountry}`);
      if (typeof ym === 'function') ym(YM_ID, 'reachGoal', 'country-filter', {country: initialCountry});
    }

    // Переключение табов
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const country = btn.getAttribute('data-tab-button').trim();
        const panel = activateByCountry(country);
        const idx = cfgIndexByCountry(country);
        if (idx >= 0 && panel) {
          loadTabDataIntoPanel(panel, window._toursByCountry[idx], `hotelData_${country}`);
          if (typeof ym === 'function') ym(YM_ID, 'reachGoal', 'country-filter', {country});
        }
      });
    });
  })();

})();
