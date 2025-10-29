import markup from './markup.html?raw';
import {ReactDomObserver} from "../../../utils.js";
import './style.css';

const quickSearchBarBlock = document?.querySelector('[data-testid="quickSearchBarBlock"]');
if (quickSearchBarBlock) {
  new ReactDomObserver('.ant-tabs-nav-list', {
    onAppear: (el) => {
      el.insertAdjacentHTML('beforeend', markup)
      const link = document?.querySelector('.promo-link');
      link && link.addEventListener('click', (e) => {
        e.preventDefault();
        ym(96674199, "reachGoal", "entry-point", {
          name_stock: {
            calendar: {
              name_point: "main_search_link",
            },
          },
        });
        window.open('https://www.coral.ru/hot-offers/kalendar-puteshestvii/', '_blank');
      })
    }
  }).start()
}
