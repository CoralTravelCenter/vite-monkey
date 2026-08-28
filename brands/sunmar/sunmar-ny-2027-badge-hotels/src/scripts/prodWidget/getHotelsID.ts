import targetHotelsJson from "../../data/TARGET_HOTELS_IDS.json";

function getHotelsID(): string[] {
    if (
        Array.isArray(targetHotelsJson) &&
        targetHotelsJson.length > 0 &&
        typeof targetHotelsJson[0] === 'string'
    ) {
        return targetHotelsJson as string[];
    }

    console.error("Массив с ID пуст или содержит некорректные данные!");
    return [];
}

export const TARGET_HOTEL_IDS: string[] = getHotelsID();