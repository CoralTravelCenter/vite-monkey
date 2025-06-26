import {insertOnce, ReactDomObserver} from "../../utils.js";
import html from './search-banner/search-banner.html?raw';
import './search-banner/search-banner.css'

const observer = new ReactDomObserver('[data-testid="virtuoso-item-list"]', {
  onAppear: (el) => {
    insertOnce(el, 'afterbegin', html);
  },
})
observer.start()
