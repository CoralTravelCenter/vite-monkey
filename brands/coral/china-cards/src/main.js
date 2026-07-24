import { markup } from "./scripts/includeImages.js";
import './style.css';

const container = document.getElementById('widget-china-card');

if (container) {
    container.insertAdjacentHTML('afterbegin', markup);
}