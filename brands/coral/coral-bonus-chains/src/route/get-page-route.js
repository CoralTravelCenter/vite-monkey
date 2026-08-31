import {ROUTES} from "../constants.js";


export function getPageRoute(url) {
  const parsedUrl = new globalThis.URL(url, window.location.origin);
  const pathname = parsedUrl.pathname.replace(/\/$/, '');
  const step = parsedUrl.searchParams.get('step');


  if (pathname === '/booking/add-passenger' && step === '0') {
    return ROUTES.BOOKING_STEP_0;
  }


  if (/\/hotels?\//.test(pathname)) {
    return ROUTES.HOTEL;
  }


  return null;
}
