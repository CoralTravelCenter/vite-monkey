import functionStr from './script.html?raw'
import {hostReactAppReady, ReactDomObserver} from "../../utils.js";
import './style.css'

function createBitrixScript() {
  const script = document.createElement("script");
  script.setAttribute("data-b24-form", "click/430/kn7zd0");
  script.setAttribute("data-skip-moving", "true");
  script.textContent = functionStr;
  return script;
}

function appendOnce(container, scriptId, scriptElement) {
  if (!container.querySelector(`#${scriptId}`)) {
    const cloned = scriptElement.cloneNode(true);
    cloned.id = scriptId;
    container.appendChild(cloned);
  }
}

function replaceButton(el) {
  const buttons = el?.querySelectorAll('#SelectRoomButton_Button');
  buttons.forEach((button, index) => {
    const parent = button.parentNode;
    appendOnce(parent, `btrx-script-${index}`, BTRX);
    button.classList.add('js-hidden');
  });
}

const BTRX = createBitrixScript();

hostReactAppReady().then(() => {
  const observer = new ReactDomObserver('#hotel-detail-area', {
    watchChild: true,
    onAppear: el => replaceButton(el),
    onChildMutate: el => replaceButton(el)
  });

  observer.start();
})
