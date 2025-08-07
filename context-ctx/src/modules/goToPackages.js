import {COUNTRY_MAP, DEPARTURE_MAP} from "../staticData.js";
import {addDaysToToday, buildFilters, filterArrivalLocation} from "../utils.js";
import {getArrivalLocations} from "./getArrivalLocations.js";
import {processPackagesFlow} from "./processPackagesFlow.js";

export async function goToPackages(
  {
    destinationCode,
    nights,
    depthDays,
    regions,
    filter,
    departureCode,
    parsedNEXT,
  }
) {
  const destination = COUNTRY_MAP[destinationCode?.toLowerCase()] || "Турция";
  const departure = departureCode ? DEPARTURE_MAP[departureCode.toLowerCase()] : "Москва";
  const departureID = parsedNEXT?.departure || "2671-5";
  const friendlyUrl = parsedNEXT?.departures?.find(d => d.id === departureID)?.friendlyUrl || "moskva";
  const depth = parseInt(depthDays) || 14;
  const nightCount = parseInt(nights) || 7;

  const targetDate = addDaysToToday(depth);
  const filterStr = filter && buildFilters(filter);

  let arrivalLocations;

  if (regions) {
    const regionsArr = regions.split(",");
    const rawLocations = await getArrivalLocations(departureID, departure, friendlyUrl, regionsArr);
    arrivalLocations = filterArrivalLocation(rawLocations, regionsArr);
  } else {
    const destinationArr = destination.split(",");
    const rawLocations = await getArrivalLocations(departureID, departure, friendlyUrl, destinationArr);
    arrivalLocations = filterArrivalLocation(rawLocations, destinationArr);
  }

  const URL = await processPackagesFlow({
    departureID,
    departure,
    friendlyUrl,
    nightCount,
    targetDate,
    filterStr,
    arrivalLocations,
  });

  window.location.href = `${URL.result.redirectionUrl}?qp=${URL.result.queryParam}&p=1&w=0&s=0`;
}
