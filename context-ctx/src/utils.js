import {FILTERS} from "./staticData.js";

export function parseNextMeta() {
  const nextData = document.getElementById("__NEXT_DATA__");
  if (!nextData) return {};

  try {
    const parsed = JSON.parse(nextData.textContent);
    return parsed?.props?.pageProps?.meta || {};
  } catch (err) {
    console.error("Ошибка парсинга __NEXT_DATA__:", err);
    return {};
  }
}

export async function fetchJSON(url, data, method = "POST") {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function hostReactAppReady(selector = "#__next > div", timeout = 200) {
  return new Promise((resolve) => {
    const checkReady = () => {
      const hostEl = document.querySelector(selector);
      if (hostEl?.getBoundingClientRect().height) {
        resolve();
      } else {
        setTimeout(checkReady, timeout);
      }
    };
    checkReady();
  });
}

export function filterArrivalLocation(serverData, data) {
  // Обработка, если передан массив названий отелей

  const normalizedNames = data.map(name =>
    name.trim().toLowerCase()
  );

  return serverData.reduce((acc, item) => {
    const normalizedName = item.name.trim().toLowerCase();

    const isMatch =
      (item.type === 7 || item.type === 0) && normalizedNames.includes(normalizedName)

    const alreadyExists = acc.some(hotel => hotel.id === item.id);

    if (isMatch && !alreadyExists) {
      acc.push(item);
    }

    return acc;
  }, []);
}


export function findDateItem(data, targetDate) {
  return data
    .filter(item => item.flightType !== 1)
    .find(item => item.date === targetDate);
}

export function addDaysToToday(days) {
  const today = new Date();
  today.setDate(today.getDate() + days);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function findNightOption(nightCount, options) {
  return options.find(option => option.value === Number(nightCount)) || null;
}


export function buildFilters(filterStr) {
  const filters = [FILTERS.available];
  if (!filterStr) return filters;
  const keys = filterStr.replace(/\s+/g, "").toLowerCase().split(",");
  for (const key of keys) {
    if (FILTERS[key]) filters.push(FILTERS[key]);
  }
  return filters;
}
