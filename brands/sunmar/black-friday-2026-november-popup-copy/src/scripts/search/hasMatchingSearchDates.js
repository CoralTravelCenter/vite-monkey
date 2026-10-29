import { matchesSearchDates } from "./searchConditions.js";

export function hasMatchingSearchDates(document, type) {
  const starts = document.querySelectorAll('input[date-range="start"]');

  for (const start of starts) {
    if (!start.getClientRects().length) continue;

    const range = start.closest(".ant-picker-range");
    const end = range?.querySelector('input[date-range="end"]');
    if (matchesSearchDates(start.value, end?.value, type)) return true;
  }

  return false;
}
