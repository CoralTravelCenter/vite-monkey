import {transferObject} from "./transferObject.ts";

export {default as MARKUP} from "../markup.html?raw";
export const HOST_SELECTOR: string = 'div[class*="ReservationWidgetV2_reservationWidgetContainer__"]';
export const TRANSFER_LIST: string = 'div[class*="ListAdvanced_listItemsContainer__"]';
export const BUTTON_CONTAINER: string = ".basic-button-container";
export const TRIGGER_SELECTOR: string = "[data-trigger-transfer]";
export const BANNER_SELECTOR: string = ".promotion-banner";

export const TRANSFER_CHARTER: transferObject = {
    container: 'div[class*="AddedServiceItem_addedServiceItem__"]',
    title: 'span[class*="AddedServiceItem_title___"]',
    textContentTitle: "Трансфер"
}

export const TRANSFER_REGULAR: transferObject = {
    container: 'div[class*="ServiceListItem_serviceListItemContainer__"]',
    title: 'span[class*="ServiceListItem_serviceListItemTitle__"]',
    textContentTitle: "Трансфер"
}