import style from './style.css?raw';
import {DataLayerWatch, ReactDomObserver} from "../../../utils.js";

(async () => {
  const link = document.createElement('style');
  link.innerText = style
  document.head.appendChild(link);

  window.dataLayer = window.dataLayer || [];

  const MONTH_IDX = ['04', '07', '08', '09'];
  const YEAR = '2026';
  const dlw = new DataLayerWatch();

  new ReactDomObserver('div[class*="ConditionalRenderer"]', {
    watchChild: true,
    onChildMutate: () => {
      dlw.onEvent('view_item_list', (evt) => {
        const targetDates = evt?.ecommerce?.items[0].item_dates;
        const [year, month, _day] = targetDates[0].split('-');
        const targetYear = year === YEAR;
        const targetMonth = MONTH_IDX.some(item => item.includes(month))

        if (targetMonth && targetYear) {
          document.body.setAttribute('data-promo-month', 'true')
        } else {
          document.body.removeAttribute('data-promo-month')
        }
      });
    }
  }).start()
})()
