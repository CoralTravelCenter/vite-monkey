const TARGET_DATE_RANGE = ['2025-12-25', '2026-01-09'];
const TARGET_COUNTRIES = new Set(['Египет', 'Турция', 'ОАЭ']);
const ELITE_FILTER = {type: 3, values: [{id: '1', value: '1'}]};
const DECRYPT_URL = '/endpoints/PackageTourHotelProduct/PriceSearchDecrypt';

async function useFetch(url, data) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return null;
  }
}

function isRangeInside(inner, outer) {
  const [inStart, inEnd] = inner.map(d => new Date(d));
  const [outStart, outEnd] = outer.map(d => new Date(d));
  return inStart >= outStart && inEnd <= outEnd;
}

function areAllCountriesAllowed(locations) {
  return locations.some(loc => TARGET_COUNTRIES.has(loc.name));
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

function isEliteFilterMatch(filters) {
  const found = filters.find(f => f.type === ELITE_FILTER.type);
  return found ? deepEqual(found, ELITE_FILTER) : false;
}

async function shouldSend() {
  const qp = location.search.match(/qp=([^&]+)/)?.[1];
  if (!qp) return false;

  const response = await useFetch(DECRYPT_URL, {queryParam: qp});
  const criterias = response?.result?.searchCriterias;
  if (!criterias) return false;

  const {additionalFilters, arrivalLocations, beginDates} = criterias;

  const isRangeOk = isRangeInside(TARGET_DATE_RANGE, beginDates);
  const isCountryOk = areAllCountriesAllowed(arrivalLocations);
  const isEliteOk = isEliteFilterMatch(additionalFilters);

  window._isSendLetters = !!(isRangeOk && isCountryOk && isEliteOk);
}

(async () => {
  await shouldSend();
})();
