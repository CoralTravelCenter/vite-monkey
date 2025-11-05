import {hostReactAppReady, ReactDomObserver} from "../../utils.js";
import markup from './markup.html?raw';
import './style.css';

(async () => {
  await hostReactAppReady()
  const obs = new ReactDomObserver('[name="regular-tab"]', {
    debug: true,
    watchAttributes: true,
    attributeFilter: ['class'],
    onAttributeMutation: (el, mutations, batch) => {
      if (batch === 3) {
        const t = document?.querySelector('.flight-locations > div:nth-child(4)')
        if (t && t.textContent.includes('SGN')) {
          const a = document?.querySelector('div[class*="PackageTourFlightHotelOverview_headerContainer"]')
          if (a) {
            a.insertAdjacentHTML('beforeend', markup)
          }
        }
      }
    },
  })
  obs.start();
})()

new ReactDomObserver('a[href*="kalendar-puteshestvii"]', {
  onAppear: (el) => {
    el && el.addEventListener('click', e => {
      e.preventDefault()
      ym(96674199, "reachGoal", "entry-point", {
        name_stock: {
          calendar: {
            name_point: "search",
          },
        },
      });
      window.open(e.currentTarget.href, '_blank')
    })
  }
}).start()
