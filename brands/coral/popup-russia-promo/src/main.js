import './style.css';
import dayjs from 'dayjs';
import {createDataLayerWatcher} from "../../../../utils/index.js";

(async () => {
  const dataLayerWatcher = createDataLayerWatcher();
  const viewItem = await dataLayerWatcher.waitEvent("search_tour");

  const hasChild = viewItem.ecommerce.items[0].item_child_count > 0;

  const dates = viewItem.ecommerce.items[0].period_flight
  const start = dayjs().startOf('day');
  const end = dayjs().add(21, 'day').endOf('day');

  const isInRange = dates.every((date) => {
    const current = dayjs(date, 'YYYY-MM-DD');
    return current.isValid() && !current.isBefore(start) && !current.isAfter(end);
  });

  if (!isInRange || !hasChild) return;

  await customElements.whenDefined('coral-popup');
  const popupEl = document.getElementById('promo_page_coral_children');
  document.body.append(popupEl)
})()
