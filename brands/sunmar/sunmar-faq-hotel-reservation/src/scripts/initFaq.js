export function initFaq(faqContainer) {
  faqContainer.addEventListener("click", (event) => {
    const question = event.target.closest?.("[data-sunmar-faq-question]");
    if (!question || !faqContainer.contains(question)) return;

    const answer = document.getElementById(
      question.getAttribute("aria-controls"),
    );
    const item = question.closest(".Sunmar-FAQ-hotel-reservation__item");
    if (!answer || !item) return;

    const isOpen = question.getAttribute("aria-expanded") === "true";
    question.setAttribute("aria-expanded", String(!isOpen));
    answer.hidden = isOpen;
    item.classList.toggle("is-open", !isOpen);
  });
}
