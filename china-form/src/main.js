import {appendOnce, insertOnce, ReactDomObserver} from "../../utils.js";
import markup from "./markup.html?raw";
import './style.css'

function createBitrixScript() {
  const script = document.createElement("script");
  script.setAttribute("data-b24-form", "click/448/xieq4o");
  script.setAttribute("data-skip-moving", "true");
  script.innerHTML = `
    (function(w, d, u) {
        var s = d.createElement('script');
        s.async = true;
        s.src = u + '?' + (Date.now() / 180000 | 0);
        var h = d.getElementsByTagName('script')[0];
        h.parentNode.insertBefore(s, h);
    })(window, document, 'https://cdn-ru.bitrix24.ru/b9730187/crm/form/loader_448.js');
	`;
  return script;
}

function init(el) {
  insertOnce(el, 'afterbegin', markup, 'china-attention');

  const placesForScript = [...document?.querySelectorAll("#bitrix")];
  const script = createBitrixScript()
  placesForScript.length > 0 && placesForScript.forEach((place) => {
    appendOnce(place, script)
  });
}

new ReactDomObserver('.no-result-message', {
  watchChild: true,
  onAppear: el => init(el.parentElement.parentElement),
  onChildMutate: el => init(el),
}).start()
