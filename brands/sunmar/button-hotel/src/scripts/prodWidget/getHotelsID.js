import targetHotelsJson from "../../data/TARGET_HOTELS_IDS.json";

function getHotelsID() {
    if(Array.isArray(targetHotelsJson) && targetHotelsJson.length > 0) {
        return targetHotelsJson;
    }
    else {
        console.error("Массив с ID пуст!");
        return [];
    }
}

export const TARGET_HOTEL_IDS = getHotelsID();