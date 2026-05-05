import {SimpleReactDomObserver} from "../../utils.js";
import markup from './markup.html?raw'
import './style.css'

const selector = 'div[class*="BasicMenu_menuContainer__"]'
new SimpleReactDomObserver(selector, {
  onAppear: (element) => {
    element.insertAdjacentHTML('beforeend', markup);
  }
}).start()
