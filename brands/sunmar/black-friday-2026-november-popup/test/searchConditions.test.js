import assert from "node:assert/strict";
import test from "node:test";
import {
  getSearchType,
  matchesSearchDates,
} from "../src/scripts/search/searchConditions.js";

for (const [start, end, expected] of [
  ["22.11.2026", "26.11.2026", true],
  ["22.11.2026", "22.11.2026", true],
  ["26.11.2026", "26.11.2026", true],
  ["23.11.2026", "25.11.2026", true],
  ["21.11.2026", "26.11.2026", false],
  ["22.11.2026", "27.11.2026", false],
  ["26.11.2026", "22.11.2026", false],
  ["22.11.2025", "26.11.2025", false],
  ["22.11.2026", undefined, false],
  ["", "", false],
  ["2026-11-22", "2026-11-26", true],
]) {
  test(`flight ${start} — ${end}`, function () {
    assert.equal(matchesSearchDates(start, end, "tour"), expected);
  });
}

test("hotel arrival is checked without limiting checkout", function () {
  assert.equal(matchesSearchDates("22.11.2026", "05.12.2026", "hotel"), true);
  assert.equal(matchesSearchDates("21.11.2026", "25.11.2026", "hotel"), false);
});

test("only Sunmar search results qualify", function () {
  for (const [url, expected] of [
    ["https://www.sunmar.ru/packagetours/test/?qp=test", "tour"],
    ["https://www.sunmar.ru/onlyhotel/test/?qp=test", "hotel"],
    ["https://www.sunmar.ru/packagetours/test/", null],
    ["https://www.sunmar.ru/?qp=test", null],
    ["https://www.coral.ru/packagetours/test/?qp=test", null],
  ])
    assert.equal(getSearchType(new URL(url)), expected);
  assert.equal(matchesSearchDates("22.11.2026", "26.11.2026", null), false);
});
