import {hostReactAppReady} from "@utils";
import {createTagScript} from "./createTagScript.js";

await hostReactAppReady();
const cmsDeferred = document.querySelector('[src*="swiper-bundle"]');
if (cmsDeferred) {
  const scriptElement = createTagScript(cmsDeferred.src);
  document.head.appendChild(scriptElement);
}