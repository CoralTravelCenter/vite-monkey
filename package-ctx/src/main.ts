import {hostReactAppReady, parseNextMeta} from "./utils.js";
import {goToPackages} from "./modules/goToPackages";
import {showCoralLoader, showSunmarLoader} from "./modules/showLoader";

(async () => {
    await hostReactAppReady()

    const urlParams: URLSearchParams = new URLSearchParams(location.search)
    const domain: string = location.host;
    if (!urlParams.has("ctx_destination")) return;

    (domain.includes('coral')) ? showCoralLoader() : showSunmarLoader()
    const parsedNEXT = parseNextMeta();

    await goToPackages(
        {
            domain: domain,
            destinationCode: urlParams.get("ctx_destination"),
            nights: urlParams.get("nights"),
            depthDays: urlParams.get("depthDays"),
            regions: urlParams?.get("districts"),
            filter: urlParams.get("filters"),
            departureCode: urlParams.get("departure"),
            parsedNEXT,
        }
    );
})();
