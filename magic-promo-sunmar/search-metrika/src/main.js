import {SimpleReactDomObserver} from "../../../utils.js";

new SimpleReactDomObserver('a[href*="banner_on_site=main-december-january"]', {
  onAppear: (el) => {
    if (!el) return;

    const slide = el?.closest('.swiper-slide');
    console.log(slide);
    const links = slide && slide?.querySelectorAll("a")

    if (links && links.length > 0) {
      links.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          ym(215233, "reachGoal", "entry_point", {
            name_stock: {
              ng_dec_jan: {
                name_point: "main_page",
              },
            },
          });
          window.open(e.currentTarget.href, '_blank');
        })
      })
    }
  }
}).start()
