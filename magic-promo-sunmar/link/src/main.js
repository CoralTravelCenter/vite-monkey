import {insertOnce, SimpleReactDomObserver} from "../../../utils.js";
import markup from './markup.html?raw';
import './style.css';

new SimpleReactDomObserver('div[class*="BasicMenu_menuContainer"]', {
  onAppear: (el) => {
    if (el) {
      const linksArr = [...el?.querySelectorAll('a')];
      if (linksArr.length > 0) {
        insertOnce(linksArr[2], 'afterend', markup)
      }

      const a = document?.querySelector('.magic-of-rest')
      if (a) {
        a.addEventListener('click', e => {
          e.preventDefault()
          ym(215233, "reachGoal", "entry_point", {
            name_stock: {
              ng_dec_jan: {
                name_point: "main_page_link",
              },
            },
          });
          window.open(e.currentTarget.href, '_blank');
        })
      }
    }
  }
}).start()
