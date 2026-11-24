import "./style.scss";

const HTML = document.documentElement;
HTML.setAttribute(
  "data-brand",
  location.hostname.includes("coral") ? "coral" : "sunmar",
);

const desktopQuery = window.matchMedia("(min-width: 993px)");
const observer = new MutationObserver(placeFilter);
let input;
const isBlackFriday = (element) =>
  element.textContent.trim().replaceAll("ё", "е") === "Черная пятница";

function placeFilter() {
  const filter = [...document.querySelectorAll(".ant-checkbox-label > span")]
    .find(isBlackFriday)
    ?.closest(".ant-space-item");
  input = filter?.querySelector('input[type="checkbox"]');
  if (!filter || !input) return false;

  const isDesktop = desktopQuery.matches;
  const target = document.querySelector(
    isDesktop
      ? '[class*="HotelListFilters_showMapWrapper__"]'
      : ".hotel-list-sort-styled",
  );
  if (!target) return false;

  observer.disconnect();
  desktopQuery.removeEventListener("change", placeFilter);
  filter.setAttribute("data-black-friday", "");
  if (isDesktop && target.nextElementSibling !== filter) target.after(filter);
  else if (!isDesktop && target.previousElementSibling !== filter)
    target.before(filter);

  const tag = [
    ...document.querySelectorAll(
      '[class*="SelectedFilters_selectedTagContainer__"] .ant-tag',
    ),
  ].find(isBlackFriday);
  tag?.setAttribute("data-filter", "BF");
  return true;
}

function handleChange(event) {
  if (event.target !== input) return;
  // Применяем после обработки нового состояния checkbox страницей.
  setTimeout(() => {
    document.querySelector('[name="Применить фильтры"]')?.click();
  }, 0);
}

document.addEventListener("change", handleChange);
if (!placeFilter()) {
  observer.observe(HTML, {
    childList: true,
    subtree: true,
    characterData: true,
    attributeFilter: ["class", "type"],
  });
  desktopQuery.addEventListener("change", placeFilter);
}
