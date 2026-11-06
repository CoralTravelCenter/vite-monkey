export { default as MARKUP1 } from "../../markup1.html?raw";
export { default as MARKUP2 } from "../../markup2.html?raw";

export const ADDITIONAL_SERVICE_STEP_SELECTOR = '[data-testid="test-extra-service-widget"]';
export const CUSTOMER_STEP_SELECTOR = '[data-testid="cf-surname-input"]';
export const PRODUCT_SUMMARY_SELECTOR = '[data-testid="product-summary"]';
export const FAQ_SELECTOR = ".Sunmar-FAQ-hotel-reservation-additional-service";

export const WATCH_SELECTOR = [
  ADDITIONAL_SERVICE_STEP_SELECTOR,
  CUSTOMER_STEP_SELECTOR,
  PRODUCT_SUMMARY_SELECTOR,
].join(", ");
