const START_DATE = "2026-11-22";
const END_DATE = "2026-11-26";

export function getSearchType(url) {
  if (!["www.sunmar.ru", "sunmar.ru"].includes(url.hostname)) return null;
  if (!url.searchParams.get("qp")) return null;
  if (url.pathname.startsWith("/packagetours/")) return "tour";
  if (url.pathname.startsWith("/onlyhotel/")) return "hotel";
  return null;
}

function normalizeDate(value) {
  if (typeof value !== "string") return null;
  const date = value.trim();
  if (/^2026-11-\d{2}$/.test(date)) return date;
  const match = /^(\d{2})\.11\.2026$/.exec(date);
  return match ? `2026-11-${match[1]}` : null;
}

export function matchesSearchDates(startValue, endValue, type) {
  if (type !== "tour" && type !== "hotel") return false;
  const start = normalizeDate(startValue);
  if (!start || start < START_DATE || start > END_DATE) return false;
  if (type === "hotel") return true;
  const end = normalizeDate(endValue);
  return Boolean(end && end >= start && end <= END_DATE);
}
