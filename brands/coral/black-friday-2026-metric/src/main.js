import { waitKvButton } from "./scripts/widgets/waitKvButton.js";
import { waitBackButton } from "./scripts/widgets/waitBackButton.js";
import { waitCountriesButtons } from "./scripts/widgets/waitCountriesButtons.js";

(async function bfMetric() {
  try {
    await Promise.all([
      waitKvButton(),
      waitBackButton(),
      waitCountriesButtons(),
    ]);
  } catch {}
})();
