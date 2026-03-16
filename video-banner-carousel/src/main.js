import {ReactDomObserver, vimeoAutoPlay} from "../../utils.js";
import markup from './markup.html?raw'
import './style.css';

const selector = '#quick-search-tab-area .swiper-container'
new ReactDomObserver(selector, {
  onAppear: async (banner) => {
    const place = banner.closest('div')
    place.setAttribute('data-video-banner', '')
    place.insertAdjacentHTML('beforeend', markup);
    await vimeoAutoPlay();

    ym(96674199, "reachGoal", "entry-point", {
      name_stock: {
        EB_landing: {
          name_point: "main_carousel",
        },
      },
    });
  }
}).start()
