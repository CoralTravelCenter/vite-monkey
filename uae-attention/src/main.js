import Accordion from "accordion-js";
import markup from './markup.html?raw';
import "accordion-js/dist/accordion.min.css";
import './style.scss'

document.getElementById('breadcrumb-widget').insertAdjacentHTML('afterend', markup)
new Accordion(".accordion-container-uae-attention");
