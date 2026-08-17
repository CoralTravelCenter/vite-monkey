import {initProdWidget} from "./initProdWidget.js";
import {TARGET_HOTEL_IDS} from "./getHotelsID.js";
import {waitForHotelID} from "./waitForHotelID.js";

export async function parseHotelWidget() {
    if (TARGET_HOTEL_IDS.length === 0) {return;}
    let currentHotelId;
    try {
        currentHotelId = await waitForHotelID();
    } catch (error) {
        throw new Error("Не удалось получить ID текущего отеля" + {cause: error});
    }
    if (currentHotelId && TARGET_HOTEL_IDS.includes(currentHotelId)) {
        await initProdWidget();
    }
}