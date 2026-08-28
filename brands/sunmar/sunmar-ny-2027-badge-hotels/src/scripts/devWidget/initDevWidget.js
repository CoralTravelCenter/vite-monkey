import { waitForElement } from "@utils";
import { markup } from "../utils/keys.js";

export async function initDevWidget() {
  try {
    const devContainer = await waitForElement("#monkey-app");
    if (devContainer.dataset.injected) return;

    devContainer.insertAdjacentHTML("afterbegin", markup);
    devContainer.dataset.injected = "true";
  } catch (error) {
    throw new Error("Ошибка инициализации dev-widget: ", {
      cause: error,
    });
  }
}
