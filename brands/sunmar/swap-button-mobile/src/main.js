import "./style.css";
import { reactDomObserver } from "@utils";
import { filter, firstValueFrom, map, timeout } from "rxjs";
import { createMobileButton } from "./scripts/createMobileButton.js";
import { initSwapAnimation } from "./scripts/initSwapAnimations.js";

(async function startSwapButton() {
  const mobileHeader = '[class*="HeaderMobile_rightGroup__"]';
  const domWatcher = reactDomObserver();
  const host = await firstValueFrom(
    domWatcher.observeSelector$(mobileHeader).pipe(
      filter(({ type }) => type !== "remove"),
      map(({ element }) => element),
      timeout({ first: 10000 }),
    ),
  );
  const element = createMobileButton();
  const swapButton = document.querySelector(".swap-button-mobile");
  if (!swapButton) {
    host.prepend(element);
    initSwapAnimation();
  }
})();
