import {SimpleReactDomObserver} from "../../utils.js";
import markup from './markup.html?raw'
import './style.css'

const selector = 'div[class*="HeaderMobile_rightGroup__"]'
new SimpleReactDomObserver(selector, {
  onAppear: (element) => {
    element.insertAdjacentHTML('afterbegin', markup);
  }
}).start()
