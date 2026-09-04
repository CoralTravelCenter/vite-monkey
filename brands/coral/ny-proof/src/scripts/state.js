import {HOTEL_ID_KEY, SEARCH_TOUR_PERIOD_KEY} from "./constants.js";

export function createInitialState() {
  return {
    hotelId: getSavedHotelId(),
    period: getSavedPeriod(),
  };
}

export function setHotelId(state, hotelId) {
  state.hotelId = hotelId;

  sessionStorage.setItem(
    HOTEL_ID_KEY,
    String(hotelId)
  );
}

export function setPeriod(state, period) {
  state.period = period;

  sessionStorage.setItem(
    SEARCH_TOUR_PERIOD_KEY,
    JSON.stringify(period)
  );
}

function getSavedHotelId() {
  return Number(
    sessionStorage.getItem(HOTEL_ID_KEY)
  );
}

function getSavedPeriod() {
  const savedPeriod = sessionStorage.getItem(
    SEARCH_TOUR_PERIOD_KEY
  );

  if (!savedPeriod) {
    return null;
  }

  try {
    return JSON.parse(savedPeriod);
  } catch {
    sessionStorage.removeItem(
      SEARCH_TOUR_PERIOD_KEY
    );

    return null;
  }
}
