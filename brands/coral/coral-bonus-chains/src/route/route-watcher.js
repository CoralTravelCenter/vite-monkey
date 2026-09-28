import {Subject} from "rxjs";
import {getPageRoute} from "./get-page-route.js";


export const route$ = new Subject();


let currentRoute = getPageRoute(location.href);


setPageDataset(currentRoute);


function setPageDataset(route) {
  if (route) {
    document.documentElement.dataset.chainCbPage = route;
    return;
  }


  delete document.documentElement.dataset.chainCbPage;
}


function updateRoute(url) {
  const nextRoute = getPageRoute(url);


  if (nextRoute === currentRoute) {
    return;
  }


  currentRoute = nextRoute;
  setPageDataset(currentRoute);
  route$.next(currentRoute);
}


window.CoralRouteBus?.subscribe?.((route) => {
  updateRoute(route?.url ?? location.href);
});


export function getCurrentRoute() {
  return currentRoute;
}
