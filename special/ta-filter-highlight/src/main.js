import "./style.scss";
import DataLayerHelper from "@utils/analytics/dataLayerHelper.js";
import { syncButton } from "./createButton.js";

const brand = window.location.hostname.match(
  /^(?:www\.)?(coral|sunmar)\.ru$/,
)?.[1];
if (brand) document.documentElement?.setAttribute("data-ptff-brand", brand);

const TARGET_DATE = "2027-04-25";
const dataLayer = (window.dataLayer ??= []);

if (brand && Array.isArray(dataLayer) && typeof dataLayer.push === "function") {
  new DataLayerHelper(
    dataLayer,
    (message) => {
      if (message?.event !== "select_room") return;

      const dates = message.ecommerce?.items?.[0]?.item_dates;
      const departureDate = Array.isArray(dates) ? dates[0] : undefined;
      const isValid =
        typeof departureDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(departureDate) &&
        departureDate >= TARGET_DATE;
      syncButton(isValid);
    },
    true,
  );
}
