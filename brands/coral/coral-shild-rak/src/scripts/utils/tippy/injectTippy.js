import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { TIPPY_CONTENT } from "../keys.js";
import "./tippy.scss";

export function injectTippy() {
  tippy("#check-rak-information-img", {
    content: TIPPY_CONTENT,
    allowHTML: true,
    appendTo: () => document.body,
    arrow: true,
    interactive: true,
    placement: "top-start",
    popperOptions: {
      modifiers: [{ name: "flip", enabled: false }],
    },
    theme: "coral-shild-rak",
  });
}
