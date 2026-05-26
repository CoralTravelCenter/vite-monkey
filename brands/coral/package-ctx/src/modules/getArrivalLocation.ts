import {fetchJSON} from "../utils.js";
import {ENDPOINTS} from "../staticData.js";
import {DepartureLocation} from "../types";

export async function getArrivalLocations(departureID: string, departure: string, friendlyUrl: string, arrivalLocation: string[], domain: string) {

    const ENDPOINT = (domain.includes('coral'))
        ? `https://b2capi.coral.ru${ENDPOINTS.packageEndpoints.listArrivalLocations}`
        : `https://b2capi.sunmar.ru${ENDPOINTS.packageEndpoints.listArrivalLocations}`

    const departureLocations: DepartureLocation[] = [{
        id: departureID,
        name: departure,
        type: 5,
        friendlyUrl,
    }];

    const locationTexts: string[] = Array.isArray(arrivalLocation)
        ? arrivalLocation.filter(Boolean).map(text => text.trim())
        : [arrivalLocation.trim()];

    const requests = locationTexts.map(text => {
        const sendData = {
            departureLocations,
            text,
        };

        return fetchJSON(
            ENDPOINT,
            sendData
        );
    });

    const responses = await Promise.all(requests);

    // Собираем и объединяем все locations
    return responses.flatMap(res => res?.result?.locations || []);
}
