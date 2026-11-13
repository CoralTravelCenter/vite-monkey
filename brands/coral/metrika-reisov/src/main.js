import DataLayerHelper from '@utils/analytics/dataLayerHelper.js';

window.dataLayer ??= [];

const continueButton = '#PackageTourFlightHotelOverviewPrice_Button-continue';
const eventKey = 'view_overview'
let isFlightStep = Boolean(document.querySelector(continueButton));
let overviewCount = 0;
let initialPrice;
let currentPrice;

function syncFlightStep() {
  const hasContinueButton = Boolean(document.querySelector(continueButton));

  if (isFlightStep && !hasContinueButton) {
    overviewCount = 0;
    initialPrice = undefined;
    currentPrice = undefined;
  }

  isFlightStep = hasContinueButton;
}

const observer = new MutationObserver(syncFlightStep);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

new DataLayerHelper(window.dataLayer, {
  listenToPast: true,

  listener(_model, message) {
    if (message?.event !== eventKey) return;

    syncFlightStep();
    overviewCount += 1;

    const value = message.ecommerce?.value;
    const price = Number.isFinite(value) ? value : undefined;

    if (overviewCount === 2) initialPrice = price;
    if (overviewCount >= 2) currentPrice = price;
  },
});

// document.addEventListener(
//   'click',
//   (event) => {
//     if (!(event.target instanceof Element)) return;
//     if (!event.target.closest(continueButton)) return;
//
//     const hasPrices = initialPrice !== undefined && currentPrice !== undefined;
//     const wouldSendGoal = hasPrices && currentPrice !== initialPrice;
//
//     console.info('[change_the_flight] Клик «Продолжить»', {
//       overviewCount,
//       initialPrice,
//       currentPrice,
//       wouldSendGoal,
//       reason: !hasPrices
//         ? 'Нет данных для сравнения'
//         : wouldSendGoal
//           ? 'Цена изменилась'
//           : 'Цена совпадает с исходной',
//     });
//   },
//   {capture: true},
// );

document.addEventListener(
  'click',
  (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(continueButton)) return;
    if (initialPrice === undefined || currentPrice === undefined) return;
    if (currentPrice === initialPrice) return;

    window.ym?.(96674199, 'reachGoal', 'change_the_flight');
  },
  {capture: true},
);
