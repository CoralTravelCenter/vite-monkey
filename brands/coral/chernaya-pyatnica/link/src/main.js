import markup from './markup.html?raw';
import './style.css'
import {SimpleReactDomObserver} from "../../../utils.js";


new SimpleReactDomObserver('a[href="/main/newyear"]', {
  onAppear: (el) => {
    if (!el) return;
    el.insertAdjacentHTML('afterend', markup)

    const button = document?.querySelector('.promo-link-jjrura0094skxw')
    if (button) {
      button.addEventListener('click', () => {
        ym(96674199, "reachGoal", "entry-point", {
          name_stock: {
            teaser_bf25: {
              name_point: "main_page_link",
            },
          },
        });
        window.open(button.getAttribute('data-href'), '_blank')
      })
    }
  }
}).start();
