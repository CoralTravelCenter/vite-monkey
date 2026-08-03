import { createDataLayerWatcher, waitForCondition } from "@utils";
import { firstValueFrom } from "rxjs";

const DLEvent = "begin_checkout";

const SEGMENT_IN_DAYS = 21;

function checkBookingDate(departureDateStr, dayDelay = SEGMENT_IN_DAYS) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = departureDateStr.split("-").map(Number);
  const departureDate = new Date(year, month - 1, day);

  const diffMs = departureDate - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= dayDelay;
}

firstValueFrom(createDataLayerWatcher().event$(DLEvent)).then((evt) => {
  const rawDate = evt?.ecommerce.items[0].item_dates[0];

  if (!rawDate) {
    console.warn("item_dates is missing in begin_checkout event");
    return;
  }

  window.__isSegment = checkBookingDate(rawDate);
  console.log(window.__isSegment);

  waitForCondition(() => window.PopMechanic, { timeoutMs: 0 }).then(
    (popmechanic) => {
      console.log();

      if (!popmechanic) {
        console.warn("PopMechanic is not defined");
        return;
      }
      popmechanic?.update();
    },
  );
});
