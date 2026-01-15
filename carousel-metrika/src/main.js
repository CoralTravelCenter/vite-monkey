import {SimpleReactDomObserver} from "../../utils.js";

const eventClick = `ym(96674199, 'reachGoal', 'entry-point', {
  name_stock: {
    BF25_2811_0112: {
      name_point: 'main_page',
    }
  }
})`;

new SimpleReactDomObserver('a[href*="banner_on_site=main-black-friday-2025"]', {
  onAppear: el => {
    el.setAttribute('onclick', eventClick);
    console.log(el)
  }
}).start()
