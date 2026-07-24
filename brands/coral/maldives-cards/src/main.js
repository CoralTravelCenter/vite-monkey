import { markup } from "./scripts/includeImages.js";
import './style.css';

const container = document.getElementById('widget-maldives-cards');

if (container) {
    container.insertAdjacentHTML('afterbegin', markup);
}