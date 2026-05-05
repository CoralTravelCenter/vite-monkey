import {insertOnce} from "../../../utils.js";

export function insertMenu({markup}) {
    insertOnce(document.body, "beforeend", markup, "custom-mobile-menu");
}
