import {insertOnce, SimpleReactDomObserver} from "../../../utils.js";
import markup from './markup.html?raw';
import './style.css';

new SimpleReactDomObserver('a[class*="LoginButton_loginButton"]', {
  onAppear: (el) => {
    const placeToInsert = el?.parentElement;
    insertOnce(placeToInsert, 'afterbegin', markup);

    const link = document?.querySelector('.promo-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        ym(215233, "reachGoal", "entry_point", {
          name_stock: {
            ng_dec_jan: {
              name_point: "main_page_mobile",
            },
          },
        });
        window.open(e.currentTarget.href, '_blank');
      })
    }
  }
}).start()
