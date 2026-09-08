import {
  ADDITIONAL_SERVICE_STEP_SELECTOR,
  CUSTOMER_STEP_SELECTOR,
  MARKUP1,
  MARKUP2,
} from "../utils/keys.js";

export function checkStep() {
  if (document.querySelector(ADDITIONAL_SERVICE_STEP_SELECTOR)) {
    return { name: "additional-service", markup: MARKUP1 };
  }

  if (document.querySelector(CUSTOMER_STEP_SELECTOR)) {
    return { name: "customer", markup: MARKUP2 };
  }

  return null;
}
