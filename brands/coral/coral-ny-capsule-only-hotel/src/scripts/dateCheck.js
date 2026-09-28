import { initWidget } from "./initWidget.js";
import { INPUT_HOTEL_SELECTOR } from "./utils/keys.ts";

const START_TIME = new Date(2026, 11, 1).getTime();
const END_TIME = new Date(2027, 0, 31, 23, 59, 59, 999).getTime();

export function isSearchDateEligible() {
  try {
    const input = document.querySelector(INPUT_HOTEL_SELECTOR);

    if (!(input instanceof HTMLInputElement)) {
      return false;
    }

    const [day, month, year] = input.value.split(".").map(Number);

    if (![day, month, year].every(Number.isInteger)) {
      return false;
    }

    const exactDate = new Date(year, month - 1, day);
    const isValidDate =
      exactDate.getFullYear() === year &&
      exactDate.getMonth() === month - 1 &&
      exactDate.getDate() === day;

    if (!isValidDate) {
      return false;
    }

    const exactTime = exactDate.getTime();

    if (exactTime < START_TIME || exactTime > END_TIME) {
      return false;
    }

    return true;
  } catch {}

  return false;
}

export async function dateCheck() {
  if (!isSearchDateEligible()) {
    return false;
  }

  try {
    return Boolean(await initWidget());
  } catch {}

  return false;
}
