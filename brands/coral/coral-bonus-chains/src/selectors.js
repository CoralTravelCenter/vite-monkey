import {ROUTES} from "./constants.js";

export const SELECTORS = {
  [ROUTES.HOTEL]: {
    mobile: 'div[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]',
    desktop: '#HotelSummaryCardCoralBlockContainerId',
  },

  [ROUTES.BOOKING_STEP_0]:
    'div[class*="ReservationStepper_reservationStepper"]',
};
