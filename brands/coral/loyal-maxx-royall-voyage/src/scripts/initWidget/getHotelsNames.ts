import targetHotelsJson from "../../data/TARGET_HOTELS_NAMES.json";

function getHotelsNames(): string[] {
    if (
        Array.isArray(targetHotelsJson) &&
        targetHotelsJson.length > 0 &&
        typeof targetHotelsJson[0] === 'string'
    ) {
        return targetHotelsJson as string[];
    }

    return [];
}

export const TARGET_HOTEL_NAMES: string[] = getHotelsNames();