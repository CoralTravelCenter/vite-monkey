import {COUNTRY_MAP, CountryCode, DEPARTURE_MAP, DepartureCode} from "../staticData.js";
import {addDays, buildFilters, filterArrivalLocation} from "../utils.js";
import {getArrivalLocations} from "./getArrivalLocation";
import {GoToPackagesParams} from "../types";


export async function goToPackages(
    {
        domain,
        destinationCode,
        nights,
        depthDays,
        regions,
        filter,
        departureCode,
        parsedNEXT,
    }: GoToPackagesParams
) {
    const destination: CountryCode | string = COUNTRY_MAP[destinationCode?.toLowerCase() as CountryCode] || "Турция";
    const departure: DepartureCode | string = departureCode ? DEPARTURE_MAP[departureCode.toLowerCase() as DepartureCode] : "Москва";
    const departureID: string = parsedNEXT?.props.pageProps.meta.departure || "2671-5";
    const friendlyUrl: string =
        parsedNEXT?.props.pageProps.meta.departures.find((d: {
            id: string;
        }) => d.id === departureID)?.friendlyUrl ?? "moskva";

    let arrivalLocations;


    const depth: number = parseInt(depthDays) || 14;
    const nightCount: number = parseInt(nights) || 7;


    const targetDate: string = addDays(depth);
    const filterStr = filter && buildFilters(filter);


    if (regions) {
        const regionsArr = regions.split(",");
        const rawLocations = await getArrivalLocations(departureID, departure, friendlyUrl, regionsArr, domain);
        arrivalLocations = filterArrivalLocation(rawLocations, regionsArr);
    } else {
        const destinationArr = destination.split(",");
        const rawLocations = await getArrivalLocations(departureID, departure, friendlyUrl, destinationArr, domain);
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
        domain
    });

    window.location.href = `${URL.result.redirectionUrl}?qp=${URL.result.queryParam}&p=1&w=0&s=0`;
}
