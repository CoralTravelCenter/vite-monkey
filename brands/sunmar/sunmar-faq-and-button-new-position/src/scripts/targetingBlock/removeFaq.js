import { FAQ_SELECTOR } from "../utils/keys.js";

export function removeFaq() {
  document.querySelectorAll(FAQ_SELECTOR).forEach((faq) => faq.remove());
}
