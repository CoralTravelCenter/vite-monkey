import {fetchJSON} from "../utils.js";

export async function getAvailableDates(departureID, departure, friendlyUrl, arrivalLocations) {
  const departureLocations = [{
    id: departureID,
    name: departure,
    type: 5,
    friendlyUrl,
  }];

  const sendData = {
    departureLocations,
    arrivalLocations,
  };

  return fetchJSON(
    "https://b2capi.coral.ru/PackageTourHotelProduct/ListAvailableDates",
    sendData
  );
}
