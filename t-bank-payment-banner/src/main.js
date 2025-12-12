import {prependOnce, SimpleReactDomObserver} from "../../utils.js";
import markup from './markup.html?raw';
import './style.css'

function createLink() {
  const link = document.createElement('a');
  link.classList.add('t-bank-payment-banner');
  link.href = 'https://www.coral.ru/poleznaya-informatsiya/onlinetour/payment/';
  link.target = '_blank';
  link.innerHTML = markup

  link.addEventListener('click', e => {
    e.preventDefault()
    ym(96674199, 'reachGoal', 't_bank_banner')
    window.open(link.href, link.target);
  })

  return link;
}

const linkToInsert = createLink()


new SimpleReactDomObserver('#paymentAgreement', {
  onAppear: el => {
    prependOnce(el, linkToInsert)
  },
}).start()
