import {SimpleReactDomObserver} from "../../../utils.js";

new SimpleReactDomObserver('#info-actions', {
  onAppear: (el) => {
    console.log(el)
  }
})
