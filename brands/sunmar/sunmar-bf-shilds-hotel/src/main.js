import "./style.scss";
import { createDataLayerWatcher } from "@utils";
import { firstValueFrom } from "rxjs";

const DL = await firstValueFrom(createDataLayerWatcher().event$("view_item"));
const productId = DL?.ecommerce?.items[0].item_id;
const detailWidget = document?.querySelector("#hotel-detail-area");
if (detailWidget) {
  detailWidget.setAttribute("data-hotel-id", productId);
}
