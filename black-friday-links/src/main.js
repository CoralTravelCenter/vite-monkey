import {doRequestToServer} from "../../utils.js";

const directions = ["ОАЭ", "Таиланд", "Вьетнам", "Египет", "Турция", "Индия", "Шри-Ланка"];
const ENDPOINTS = {
  arrivalLocations: '/endpoints/PackageTourHotelProduct/ListArrivalLocations',
  encrypt: '/endpoints/PackageTourHotelProduct/PriceSearchEncrypt',
};
const DATES_MAP = {
  "ОАЭ": ['2026-01-10', '2026-10-31'],
  "Таиланд": ['2026-02-01', '2026-10-31'],
  "Вьетнам": ['2026-01-10', '2026-03-31'],
  "Египет": ['2026-01-15', '2026-10-31'],
  "Турция": ['2026-04-01', '2026-10-31'],
  "Индия": ['2025-11-29', '2026-04-30'],
  "Шри-Ланка": ['2025-11-29', '2026-04-30'],
};
const MOSCOW_DEPARTURE = {id: "2671-5", name: "Москва", type: 5, friendlyUrl: "moskva"};

const DEFAULT_BEGIN_DATES = ['2026-01-12', '2026-01-18'];

const filterType = location.host.includes('coral') ? '52' : "26";

function findExactString(arr, value) {
  return arr.find(item => item === value) || null;
}

function createArrivalPayload(hotelName) {
  return {
    departureLocations: [MOSCOW_DEPARTURE],
    text: hotelName.trim()
  };
}

async function fetchArrivalLocations(directionKeyRaw) {
  const directionKey = directionKeyRaw.trim();
  const direction = findExactString(directions, directionKey);

  // если направление не нашли — дальше нет смысла идти
  if (!direction) {
    console.warn(`Неизвестное направление: "${directionKey}"`);
    return null;
  }

  // здесь direction — уже "ОАЭ" / "Таиланд" и т.п.
  return doRequestToServer(
    ENDPOINTS.arrivalLocations,
    createArrivalPayload(direction)
  );
}

async function buildSearchUrlForDirection(directionKeyRaw = "ОАЭ") {
  const directionKey = directionKeyRaw.trim();

  const response = await fetchArrivalLocations(directionKey);
  if (!response || !response.result || !Array.isArray(response.result.locations) || !response.result.locations.length) {
    return null;
  }

  const beginDates = DATES_MAP[directionKey] || DEFAULT_BEGIN_DATES;
  const arrivalLocations = response.result.locations;
  const correctLocations = arrivalLocations.find(location => location.type === 0);

  const payload = {
    beginDates,
    arrivalLocations: [correctLocations],
    departureLocations: [MOSCOW_DEPARTURE],
    nights: [{value: 7}],
    datePickerMode: 0,
    roomCriterias: [
      {
        passengers: [
          {age: 20, passengerType: 0},
          {age: 20, passengerType: 0}
        ]
      }
    ],
    reservationType: 2,
    paging: {pageNumber: 1, pageSize: 20, sortType: 0},
    additionalFilters: [
      {
        "type": 21,
        "values": [
          {
            "id": "2",
            "value": "2"
          }
        ]
      },
      {
        "type": 3,
        "values": [
          {
            "id": filterType,
            "value": filterType
          }
        ],
        "providers": []
      }
    ],
    imageSizes: [0]
  }

  const res = await doRequestToServer(ENDPOINTS.encrypt, payload);

  const result = res?.result;
  if (!result) return null;

  const {queryParam, redirectionUrl} = result;
  return `${redirectionUrl}?qp=${queryParam}&p=1&w=0&s=0`;
}

function destinationHandleClick(e) {
  e.preventDefault();

  const directionKey = e.currentTarget.getAttribute('data-destenation');
  if (!directionKey) return;
  
  const popup = window.open('', '_blank');

  buildSearchUrlForDirection(directionKey)
    .then((url) => {
      if (!url) {
        if (popup) popup.close();
        return;
      }

      if (popup) {
        // попап не заблокирован — просто меняем адрес
        popup.location.href = url;
      } else {
        // попап заблокировали — уходим в этой же вкладке
        window.location.href = url;
      }
    })
    .catch((err) => {
      console.error(err);
      if (popup) popup.close();
    });
}

const elements = document.querySelectorAll('[data-destenation]');
elements.forEach((el) => el.addEventListener('click', destinationHandleClick));
