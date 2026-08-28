import assert from "node:assert/strict";
import test from "node:test";

const EXPECTED_EXPORTS = [
  "ClickOutside",
  "CoralCookieObserver",
  "appendOnce",
  "arrayOfNodesWith",
  "asap",
  "copyToClipboard",
  "createDataLayerWatcher",
  "debounce",
  "doRequestToServer",
  "endpointUrl",
  "generateRandomId",
  "getBrand",
  "getLocalStorageWithExpiry",
  "getMobileOS",
  "getNextData",
  "hostReactAppReady",
  "insertAfter",
  "insertOnce",
  "loadScript",
  "mediaMatcher",
  "params2query",
  "prependOnce",
  "queryParam",
  "reactDomObserver",
  "requestJson",
  "runOncePerSession",
  "sendYandexEventOnce",
  "setLocalStorageWithExpiry",
  "setYMTarget",
  "spyMainCarousel",
  "waitForCondition",
  "waitForElement",
  "waitForIntersection",
  "waitForMutation",
  "waitUntilElementsGone",
  "watchIntersection",
  "watchMainCarouselSlides",
];

test("utils barrel exposes the stable public API", async () => {
  globalThis.window = {
    document: {
      documentElement: {
        matches: () => false,
      },
    },
  };

  const publicApi = await import("../utils/index.js");

  assert.deepEqual(Object.keys(publicApi).sort(), EXPECTED_EXPORTS.sort());
});
