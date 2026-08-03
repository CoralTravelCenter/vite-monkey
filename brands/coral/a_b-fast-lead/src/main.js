import { createDataLayerWatcher, waitForCondition } from "@utils";
import { firstValueFrom } from "rxjs";

firstValueFrom(createDataLayerWatcher().event$("begin_checkout")).then(
  (evt) => {
    const raw = evt?.ecommerce?.items?.[0]?.item_dates?.[0];
    const limit = new Date(Date.now() + 21 * 86400000)
      .toISOString()
      .split("T")[0];
    const target = new Date(raw).toISOString().split("T")[0];
    window.__segmentIsIn = target > limit;
    waitForCondition(() => window.PopMechanic, { timeoutMs: 0 }).then(() => {
      window.PopMechanic.update();
    });
  },
);
