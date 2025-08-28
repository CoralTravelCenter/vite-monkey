import {waitForDLEvent, waitForWindowVar} from "../../utils.js";

waitForDLEvent('begin_checkout')
  .then(evt => {
    const raw = evt?.ecommerce?.items?.[0]?.item_dates?.[0];
    const limit = new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0];
    const target = new Date(raw).toISOString().split('T')[0];
    window.__segmentIsIn = target > limit;
    waitForWindowVar("PopMechanic").then(() => {
      window.PopMechanic.update()
    });
  });
