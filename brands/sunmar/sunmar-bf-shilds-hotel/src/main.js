import "./style.scss";
import { createDataLayerWatcher } from "@utils";

const DL = await createDataLayerWatcher().waitEvent("view_item", {
  timeoutMs: 0,
});
const productId = DL?.ecommerce?.items[0].item_id;
const detailWidget = document?.querySelector("#hotel-detail-area");
if (detailWidget) {
  detailWidget.setAttribute("data-hotel-id", productId);
}
