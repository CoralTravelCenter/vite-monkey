import './style.css'
import {prependOnce, SimpleReactDomObserver} from "../../utils.js";

function createLink() {
  const link = document.createElement('a');
  link.href = 'https://www.sunmar.ru/bookinghotel/?p=2';
  link.className = 'promo-link-mobile';
  return link;
}

new SimpleReactDomObserver('a[class*="LoginButton_loginButton"]', {
  onAppear: el => {
    prependOnce(el, createLink())
  }
}).start();
