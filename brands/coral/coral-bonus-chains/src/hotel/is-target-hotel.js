import {normalizeHotelName} from "./normalize-hotel-name.js";


export function createTargetHotelMatcher(hotels) {
  const targetHotels = new Set(hotels.map(normalizeHotelName));

  return (name) => targetHotels.has(normalizeHotelName(name));
}
