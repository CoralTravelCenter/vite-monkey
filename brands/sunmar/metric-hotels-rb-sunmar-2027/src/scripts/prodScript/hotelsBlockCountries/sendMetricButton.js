import {findHotelBlock} from "./findHotelBlock.js";
import {sendMetricHotel} from "./sendMetricHotel.js";
import {outputErrorMessage} from "../../utils/errorMessage.js";

export function sendMetricButton() {
    document.addEventListener('click', async (event) => {
        try {
            const targetHotel = await findHotelBlock(event);
            if (!targetHotel) return;

            sendMetricHotel(targetHotel.countryName, targetHotel.hotelName);
        } catch (error) {
            outputErrorMessage("Ошибка при нажатии кнопки отеля", error);
        }
    });
}