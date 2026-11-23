import "./style.scss";
import { mediaMatcher } from "@utils";

const HTML = document.documentElement;
HTML.setAttribute(
  "data-brand",
  location.hostname.includes("coral") ? "coral" : "sunmar",
);

let input;
let isDesktop;
const isBlackFriday = (element) =>
  element.textContent.trim().replaceAll("ё", "е") === "Черная пятница";

function syncFilter() {
  const filter = [...document.querySelectorAll(".ant-checkbox-label > span")]
    .find(isBlackFriday)
    ?.closest(".ant-space-item");
  input = filter?.querySelector('input[type="checkbox"]');
  const target = document.querySelector(
    isDesktop
      ? '[class*="HotelListFilters_showMapWrapper__"]'
      : ".hotel-list-sort-styled",
  );
  if (filter && target) {
    filter.setAttribute("data-black-friday", "");
    if (isDesktop && target.nextElementSibling !== filter) target.after(filter);
    else if (!isDesktop && target.previousElementSibling !== filter)
      target.before(filter);
  }

  const tag = [
    ...document.querySelectorAll(
      '[class*="SelectedFilters_selectedTagContainer__"] .ant-tag',
    ),
  ].find(isBlackFriday);
  tag?.setAttribute("data-filter", "BF");
}

function handleChange(event) {
  if (event.target !== input) return;
  syncFilter();
  // Применяем после обработки нового состояния checkbox страницей.
  setTimeout(() => {
    document.querySelector('[name="Применить фильтры"]')?.click();
  }, 0);
}

new MutationObserver(syncFilter).observe(HTML, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["class", "checked"],
});
document.addEventListener("change", handleChange);
mediaMatcher(993, (matches) => {
  isDesktop = matches;
  syncFilter();
});
