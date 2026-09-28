// import './config.js';
import './style.scss';

import {take} from "rxjs";

import {createDataLayerWatcher, mediaMatcher, reactDomObserver} from "@utils";


import {getCurrentRoute, route$} from "./route/route-watcher.js";
import {SELECTORS} from "./selectors.js";
import {renderShield} from "./shield/render-shield.js";
import {createTargetHotelMatcher} from "./hotel/is-target-hotel.js";
import {ROUTES} from "./constants.js";
import {applyHotelBadgeStyles} from "./hot-deals/apply-hotel-badge-styles.js";


function initCoralBonusChains(config) {
  if (!config || !Array.isArray(config.hotels)) {
    console.error('CoralBonus: некорректный конфиг', config);
    return;
  }

  const isTargetHotel = createTargetHotelMatcher(config.hotels);
  applyHotelBadgeStyles(config);

  const dataLayerWatcher = createDataLayerWatcher();
  const domWatcher = reactDomObserver();


  let matchesTargetHotel = false;
  let matchesDesktopViewport = false;
  let hostSubscription = null;
  const hotelMatchByRoute = new Map();


  mediaMatcher(992, (matches) => {
    matchesDesktopViewport = matches;

    if (getCurrentRoute() === ROUTES.HOTEL) {
      renderCurrentPage();
    }
  });


// Replay позволяет выполнить первичную проверку уже заполненного dataLayer.
  dataLayerWatcher
    .event$("view_item")
    .subscribe((event) => updateHotel(event, ROUTES.HOTEL));


  dataLayerWatcher
    .event$("begin_checkout")
    .subscribe((event) => updateHotel(event, ROUTES.BOOKING_STEP_0));


  function updateHotel(event, eventRoute) {
    const hotelName = event?.ecommerce?.items?.[0]?.item_name;


    if (!hotelName) {
      return;
    }


    const matchesHotel = isTargetHotel(hotelName);
    hotelMatchByRoute.set(eventRoute, matchesHotel);


    if (getCurrentRoute() !== eventRoute) {
      return;
    }


    matchesTargetHotel = matchesHotel;


    if (!matchesTargetHotel) {
      removeShield();
    }


    renderCurrentPage();
  }


// реагируем только на смену страниц
  route$.subscribe((route) => {
    if (hotelMatchByRoute.has(route)) {
      matchesTargetHotel = hotelMatchByRoute.get(route);
    }


    renderCurrentPage();

  });


  function renderCurrentPage() {
    hostSubscription?.unsubscribe();
    hostSubscription = null;


    if (!matchesTargetHotel) {
      removeShield();
      return;
    }

    const route = getCurrentRoute();

    const selector = route === ROUTES.HOTEL
      ? SELECTORS[route][matchesDesktopViewport ? 'desktop' : 'mobile']
      : SELECTORS[route];


    if (!selector) {
      removeShield();
      return;
    }


    hostSubscription = domWatcher
      .observeSelector$(selector, {emitRemove: false})
      .pipe(take(1))
      .subscribe(({element}) => {
        if (route === getCurrentRoute() && matchesTargetHotel) {
          renderShield(element, route, config);
        }
      });
  }


  function removeShield() {
    document.querySelector('[data-chain-cb-shield]')?.remove();
  }
}


window.initCoralBonusChains = initCoralBonusChains;
