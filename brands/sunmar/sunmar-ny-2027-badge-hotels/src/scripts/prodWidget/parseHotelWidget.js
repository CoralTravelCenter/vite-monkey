import { initProdWidget } from "./initProdWidget.js";
import { TARGET_HOTEL_IDS } from "./getHotelsID.ts";
import { waitForHotelID } from "./waitForHotelID.js";

export async function parseHotelWidget() {
  if (TARGET_HOTEL_IDS.length === 0) return;

  try {
    const currentHotelId = await waitForHotelID();
    if (currentHotelId && TARGET_HOTEL_IDS.includes(currentHotelId)) {
      await initProdWidget();
    }
  } catch (error) {
    throw new Error("Не удалось получить ID текущего отеля", {
      cause: error,
    });
  }
}
