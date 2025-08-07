import {getAvailableDates} from "./getAvaliableDates.js";
import {findDateItem, findNightOption} from "../utils.js";
import {getAvailableNights} from "./getAvailableNights.js";
import {getRedirectURL} from "./getRedirectUrl.js";

export async function processPackagesFlow(
  {
    departureID,
    departure,
    friendlyUrl,
    nightCount,
    targetDate,
    filterStr,
    arrivalLocations,
  }
) {
  const availableDates = await getAvailableDates(departureID, departure, friendlyUrl, arrivalLocations);
  const neededDate = findDateItem(availableDates?.result?.dates, targetDate);

  const availableNights = await getAvailableNights(departureID, departure, friendlyUrl, arrivalLocations, neededDate);
  const targetNights = findNightOption(nightCount, availableNights?.result?.nights);

  return await getRedirectURL(departureID, departure, friendlyUrl, neededDate, arrivalLocations, targetNights, filterStr);
}
