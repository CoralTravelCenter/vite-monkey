import {DATES, HOTELS_ID} from "../hotelsConfig.js";

export function isNyProofEligible({
                                    hotelId,
                                    period,
                                  }) {
  const isHotelIncluded =
    HOTELS_ID.includes(hotelId);

  const isDateRangeIncluded =
    period?.[0] >= DATES[0] &&
    period?.[1] <= DATES[1];

  return {
    isHotelIncluded,
    isDateRangeIncluded,
    isEligible:
      isHotelIncluded &&
      isDateRangeIncluded,
  };
}
