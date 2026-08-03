import './style.css';
import {initDevWidget} from "./scripts/initDevWidget.js";
import {initProdWidget} from "./scripts/initProdWidget.js";
import {getHotelId} from "./scripts/getHotelID.js";
import {TARGET_HOTEL_IDS} from "./scripts/targetHotels.js";

(async function installWidget() {
  if (import.meta.env.DEV) {
    try {
      await initDevWidget();
    }
    catch (error) {
      console.error(`Ошибка инициализации dev-блока: ${error}`);
    }
  }
  else {
    const currentHotelId = await getHotelId();
    if (currentHotelId && TARGET_HOTEL_IDS.includes(currentHotelId)) {
      try {
        await initProdWidget();
      }
      catch (error) {
        console.error(`Ошибка инициализации виджете отелей: ${error}`);
      }
    }
  }
})();