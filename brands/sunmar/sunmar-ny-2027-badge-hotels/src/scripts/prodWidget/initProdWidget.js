import { waitForElement } from "@utils";
import { markup } from "../utils/keys.js";

export async function initProdWidget() {
  try {
    const galleryTarget = await waitForElement('[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]');
    if (galleryTarget.querySelector(".sunmar-ny-2027-badge-root")) return;

    const badgeWrapper = document.createElement("div");
    badgeWrapper.className = "sunmar-ny-2027-badge-root";
    badgeWrapper.insertAdjacentHTML("beforeend", markup);

    galleryTarget.classList.add("sunmar-ny-2027-badge-gallery");
    galleryTarget.append(badgeWrapper);
  } catch (error) {
    throw new Error("Ошибка поиска галереи или вставки бейджа", {
      cause: error,
    });
  }
}
