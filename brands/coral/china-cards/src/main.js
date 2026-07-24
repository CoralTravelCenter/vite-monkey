import { markup } from "./scripts/includeImages.js";
import './style.css';

const container = document.getElementById('widget-china-cards');

if (container) {
    container.insertAdjacentHTML('afterbegin', markup);
}