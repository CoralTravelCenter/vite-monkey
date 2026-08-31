import {normalizeHotelName} from "./normalize-hotel-name.js";


const TARGET_HOTELS = new Set(
  window._coralBonusChains.hotels.map(normalizeHotelName)
);


export function isTargetHotel(name) {
  return TARGET_HOTELS.has(normalizeHotelName(name));
}
