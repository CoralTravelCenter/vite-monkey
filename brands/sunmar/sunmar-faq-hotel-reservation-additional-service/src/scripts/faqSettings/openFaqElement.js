import { metric } from "../utils/metric.js";

export function openFaqElement(faqContainer) {
  let metricSent = false;

  faqContainer.addEventListener("click", (event) => {
    const question = event.target.closest?.(
      "[data-sunmar-faq-hotel-reservation-additional-service-question]",
    );
    if (!question || !faqContainer.contains(question)) return;

    const answer = document.getElementById(
      question.getAttribute("aria-controls"),
    );
    const item = question.closest(
      ".Sunmar-FAQ-hotel-reservation-additional-service__item",
    );
    if (!answer || !item) return;

    if (!metricSent) {
      metricSent = metric(faqContainer.dataset.sunmarFaqStep);
    }

    const isOpen = question.getAttribute("aria-expanded") === "true";
    question.setAttribute("aria-expanded", String(!isOpen));
    answer.hidden = isOpen;
    item.classList.toggle("is-open", !isOpen);
  });
}
