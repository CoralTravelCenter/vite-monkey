import { markup } from "./scripts/includeImages.js";
import './style.css';

function startOnCrm(){
    const prodContainer = document.getElementById('widget-maldives-cards');

    if (prodContainer && !prodContainer.dataset.injected) {
        prodContainer.innerHTML = markup;
        prodContainer.dataset.injected = 'true';
    }
}

startOnCrm();