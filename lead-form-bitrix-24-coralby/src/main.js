import {appendOnce, hostReactAppReady, ReactDomObserver} from "../../utils.js";
import './style.css'

function createBitrixScript() {
  const script = document.createElement("script");
  script.setAttribute("data-b24-form", "click/430/kn7zd0");
  script.setAttribute("data-skip-moving", "true");
  script.textContent = `(function(w,d,u){
var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
})(window,document,'https://cdn-ru.bitrix24.ru/b9730187/crm/form/loader_430.js');`
  return script
}

function replaceButton(el) {
  const buttons = el?.querySelectorAll('.select-room-btn ')
  buttons.forEach(button => {
    button.classList.add('js-hidden');
    appendOnce(button.parentNode, createBitrixScript())
  })
}

hostReactAppReady().then(() => {
  const observer = new ReactDomObserver('#select-room-container > div', {
    watchChild: true,
    onAppear: el => replaceButton(el),
    onChildMutate: el => replaceButton(el),
  })
  observer.start()
})
