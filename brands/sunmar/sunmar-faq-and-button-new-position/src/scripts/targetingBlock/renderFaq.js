import { waitForElement } from "@utils";
import { openFaqElement } from "../faqSettings/openFaqElement.js";
import { FAQ_SELECTOR, PRODUCT_SUMMARY_SELECTOR } from "../utils/keys.js";
import { checkStep } from "./checkStep.js";
import { removeFaq } from "./removeFaq.js";

export async function renderFaq(revision, isCurrentRevision) {
  const step = checkStep();

  if (!step) {
    removeFaq();
    return;
  }

  const productSummary = await waitForElement(PRODUCT_SUMMARY_SELECTOR);
  if (!isCurrentRevision(revision)) return;

  const container = productSummary.closest("#section-column-1");
  if (!container) return;

  const currentFaq = container.querySelector(FAQ_SELECTOR);
  if (currentFaq?.dataset.sunmarFaqStep === step.name) return;

  removeFaq();
  container.insertAdjacentHTML("beforeend", step.markup);

  const faqContainer = container.querySelector(FAQ_SELECTOR);
  if (!faqContainer) return;

  faqContainer.dataset.sunmarFaqStep = step.name;
  openFaqElement(faqContainer);
}
