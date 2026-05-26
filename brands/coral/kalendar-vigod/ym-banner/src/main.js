import {ReactDomObserver} from "../../../utils.js";

new ReactDomObserver('a[href*="kalendar-puteshestvii"]', {
  onAppear: (el) => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const target = e.currentTarget;
      ym(96674199, "reachGoal", "entry-point", {
        name_stock: {
          calendar: {
            name_point: "main_page",
          },
        },
      });
      window.open(target.href, '_blank');
    })
  }
}).start()
