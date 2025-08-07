import {showLoader} from "./modules/loader.js";
import {hostReactAppReady, parseNextMeta} from "./utils.js";
import {goToPackages} from "./modules/goToPackages.js";

(async function initCtxRedirector() {
  await hostReactAppReady()

  const urlParams = new URLSearchParams(window.location.search)
  if (!urlParams.has("ctx_destination")) return;

  showLoader();
  const parsedNEXT = parseNextMeta();

  await goToPackages({
    destinationCode: urlParams.get("ctx_destination"),
    nights: urlParams.get("nights"),
    depthDays: urlParams.get("depthDays"),
    regions: urlParams?.get("districts"),
    filter: urlParams.get("filters"),
    departureCode: urlParams.get("departure"),
    parsedNEXT,
  });
})();

// ?ctx_destination=tr&districts=RIXOS%20PARK%20BELEK&departure=msk&nights=7&depthDays=30
