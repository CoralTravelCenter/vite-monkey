// import markup from './markup.html?raw'
// import './style.scss'
import css from './quiz-inside.css?inline'
import {SimpleReactDomObserver} from "../../utils.js";
import './quiz-outside.css'

// document.getElementById('monkey-app').insertAdjacentHTML('afterbegin', markup)

new SimpleReactDomObserver('#qz-container', {
  onAppear: host => {
    const shadow = host.shadowRoot
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    shadow.adoptedStyleSheets = [sheet];
  }
}).start()
