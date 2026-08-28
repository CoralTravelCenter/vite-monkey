import {sum} from "./sum.ts";

export function outputWidget(widget) {
    widget.innerHTML = sum(2, 3);
}