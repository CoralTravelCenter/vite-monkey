import functionStr from './script.html?raw'
import {ReactDomObserver} from "../../utils.js";
import './style.css'


function createBitrixScript() {
  const script = document.createElement("script");
  script.setAttribute("data-b24-form", "click/430/kn7zd0");
  script.setAttribute("data-skip-moving", "true");
  script.textContent = functionStr
  return script
}

const BTRX = createBitrixScript()

function replaceButton(el) {
  const buttons = el?.querySelectorAll('#SelectRoomButton_Button')
  console.log(buttons)
  buttons.forEach(button => {
    button.parentNode.append(BTRX)
    button.classList.add('js-hidden');
  })
}

const observer = new ReactDomObserver('#select-room-container > div', {
  debug: true,
  watchChild: true,
  onAppear: el => replaceButton(el),
  onChildMutate: el => replaceButton(el)
});
observer.start();
