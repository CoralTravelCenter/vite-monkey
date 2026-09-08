// import markup from './markup1.html?raw'
// import './style.scss'
import {hostReactAppReady, vimeoAutoPlay} from "../../utils.js";

// const container = document.getElementById('monkey-app');
// container.insertAdjacentHTML('afterbegin', markup)

(async () => {
    await hostReactAppReady()
    vimeoAutoPlay()
})()