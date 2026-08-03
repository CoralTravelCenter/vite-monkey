import './style.css';
import {createDataLayerWatcher} from "@utils";
import {firstValueFrom} from "rxjs";

(async () => {
  const IDS = ["983", "11754", "453", "5217", "78864", "49757", "7891", "10796", "196", "19943"];
  const viewItem = await firstValueFrom(
    createDataLayerWatcher().event$('view_item'),
  );
  const currentId = viewItem?.ecommerce?.items?.[0]?.item_id;
  const isHotel = IDS.includes(currentId);
  if (!isHotel) return;
  document.body.setAttribute('data-promo', 'hotels-of-week')
})()
