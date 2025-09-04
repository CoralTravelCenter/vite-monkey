import markup from './markup.html?raw';
import {insertOnce} from "../../../utils.js";
import './style.css';

const params = new URLSearchParams(window.location.search);
const showModalEveryTime = params.get('showModalEveryTime') === 'true';


const wasModalShownLastHour = () => {
  const lastShown = parseInt(localStorage.getItem('modalLastShownTime'), 10);
  if (!lastShown || isNaN(lastShown)) return false;
  const oneHour = 60 * 60 * 1000;
  return (Date.now() - lastShown) < oneHour;
};

if (showModalEveryTime || !wasModalShownLastHour()) {
  insertOnce(document.body, 'beforeend', markup)
  const closeButton = document?.querySelector('.modal-close');
  if (closeButton) {


    closeButton.addEventListener('click', function () {
      const overlay = document.querySelector('.modal-overlay');
      const container = document.querySelector('.modal-container');
      document.body.removeChild(overlay);
      document.body.removeChild(container);

      if (!showModalEveryTime) {
        localStorage.setItem('modalLastShownTime', Date.now().toString());
      }
    })
  }
  ym(96674199, 'reachGoal', 'show_5_onlyhotel')
}
