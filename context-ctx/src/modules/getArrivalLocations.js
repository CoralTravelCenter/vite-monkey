import {fetchJSON} from "../utils.js";

export async function getArrivalLocations(departureID, departure, friendlyUrl, arrivalLocation) {
  const departureLocations = [{
    id: departureID,
    name: departure,
    type: 5,
    friendlyUrl,
  }];

  const locationTexts = Array.isArray(arrivalLocation)
    ? arrivalLocation.filter(Boolean).map(text => text.trim())
    : [arrivalLocation.trim()];

  const requests = locationTexts.map(text => {
    const sendData = {
      departureLocations,
      text,
    };

    return fetchJSON(
      "https://b2capi.coral.ru/PackageTourHotelProduct/ListArrivalLocations",
      sendData
    );
  });

  const responses = await Promise.all(requests);

  // Собираем и объединяем все locations
  return responses.flatMap(res => res?.result?.locations || []);
}
