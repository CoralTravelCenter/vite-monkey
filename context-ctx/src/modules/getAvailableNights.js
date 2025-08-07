import {fetchJSON} from "../utils.js";

export async function getAvailableNights(departureID, departure, friendlyUrl, filteredArrivalLocations, neededDate) {
  const departureLocations = [{
    id: departureID,
    name: departure,
    type: 5,
    friendlyUrl,
  }];

  const sendData = {
    flightType: neededDate?.flightType,
    beginDates: [neededDate?.date],
    departureLocations,
    arrivalLocations: filteredArrivalLocations,
    calculateAvailableNightRanges: true
  };

  return fetchJSON(
    "https://b2capi.coral.ru/PackageTourHotelProduct/ListAvailableNights",
    sendData
  );
}
