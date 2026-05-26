// import markup from './markup.html?raw'
// import './style.css'
import {hostReactAppReady, vimeoAutoPlay} from "../../utils.js";

// const container = document.getElementById('monkey-app');
// container.insertAdjacentHTML('afterbegin', markup)

(async () => {
    await hostReactAppReady()
    vimeoAutoPlay()
})()