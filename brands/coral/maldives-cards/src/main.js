import {markup} from "./scripts/includeImages.js";
import './style.css';

await hostReactAppReady();
document.getElementById('monkey-app').insertAdjacentHTML('afterbegin', markup);