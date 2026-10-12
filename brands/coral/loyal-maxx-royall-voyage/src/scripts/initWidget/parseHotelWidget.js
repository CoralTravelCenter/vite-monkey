import { TARGET_HOTEL_NAMES } from "./getHotelsNames.ts";
import { waitForHotelName } from "./waitForHotelNames.js";
import {initWidget} from "./initWidget.js";
import {BANNER_HTML_MAX_ROYAL, BANNER_HTML_VOYAGE} from "../utils/keys.js";
import {stringNormal} from "./stringNormal.ts";

export async function parseHotelWidget() {
  if (TARGET_HOTEL_NAMES.length === 0) return;
  try {
    const currentHotelName = await waitForHotelName();
    if (!currentHotelName && !stringNormal(TARGET_HOTEL_NAMES).includes(currentHotelName)) return;
    const hotelName = stringNormal(currentHotelName);

    if (hotelName.includes("maxx") && hotelName.includes("royal")) {
      await initWidget(BANNER_HTML_MAX_ROYAL);
    }
    if (hotelName.includes("voyage")) {
      await initWidget(BANNER_HTML_VOYAGE);
    }
  } catch {}
}
