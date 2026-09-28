import {setHotelId, setPeriod,} from "./state.js";
import {LOG_PREFIX} from "./constants.js";


export function subscribeToDataLayer({
                                       watcher,
                                       state,
                                       onStateChange,
                                     }) {
  watcher
    .freshEvent$("view_item")
    .subscribe((itemEvent) => {
      const hotelId = Number(
        itemEvent?.ecommerce?.items?.[0]?.item_id
      );

      console.log(
        `${LOG_PREFIX} fresh view_item:`,
        hotelId
      );

      if (!hotelId) {
        return;
      }

      setHotelId(state, hotelId);

      console.log(
        `${LOG_PREFIX} hotel ID saved:`,
        hotelId
      );

      onStateChange();
    });

  watcher
    .freshEvent$("search_tour")
    .subscribe((dateEvent) => {
      const period =
        dateEvent?.ecommerce?.items?.[0]?.period_flight;

      console.log(
        `${LOG_PREFIX} fresh search_tour:`,
        period
      );

      if (!period) {
        return;
      }

      setPeriod(state, period);

      console.log(
        `${LOG_PREFIX} period saved:`,
        period
      );

      onStateChange();
    });
}
