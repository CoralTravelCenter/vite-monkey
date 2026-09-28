import {DATES} from "../hotelsConfig.js";
import {isNyProofEligible} from "./eligibility.js";

const LOG_PREFIX = "[NY Proof]";

export function createCheckAndLoadStyles(state) {
  let stylesLoaded = false;

  return async function checkAndLoadStyles() {
    if (stylesLoaded) {
      return;
    }

    const {
      isHotelIncluded,
      isDateRangeIncluded,
      isEligible,
    } = isNyProofEligible(state);

    console.log(`${LOG_PREFIX} conditions:`, {
      currentHotelId: state.hotelId,
      currentPeriod: state.period,
      allowedPeriod: DATES,
      isHotelIncluded,
      isDateRangeIncluded,
      shouldRender: isEligible,
    });

    if (!isEligible) {
      return;
    }

    stylesLoaded = true;

    try {
      await import("../styles/experimentalShield.scss");
      await import("../styles/experimanetalBanner.scss");

      console.log(`${LOG_PREFIX} styles loaded`);
    } catch (error) {
      stylesLoaded = false;

      console.error(
        `${LOG_PREFIX} failed to load styles:`,
        error
      );
    }
  };
}
