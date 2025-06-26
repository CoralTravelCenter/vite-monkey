import './home/home.css'
import {appendOnce} from "../../utils.js";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const placeToInsert = document.querySelector("#quick-search-tab-area + div .swiper");

const div = document.createElement("div")
div.id = "youth_day_2025_entry";

const headline = document.createElement("h3");
headline.innerHTML = '<h3>Почему еще<br> не в отпуске?</h3>';

const button = document.createElement("button");
button.classList.add("link");
button.style.display = "none";
button.textContent = 'Исправить'

const closeButton = document.createElement("button");
closeButton.classList.add("close");
closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\n' +
  '  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.22707 6.22703C6.51996 5.93414 6.99484 5.93414 7.28773 6.22703L12 10.9393L16.7124 6.22703C17.0052 5.93414 17.4801 5.93414 17.773 6.22703C18.0659 6.51992 18.0659 6.9948 17.773 7.28769L13.0607 12L17.773 16.7123C18.0659 17.0052 18.0659 17.4801 17.773 17.773C17.4801 18.0659 17.0052 18.0659 16.7124 17.773L12 13.0607L7.28773 17.773C6.99484 18.0659 6.51996 18.0659 6.22707 17.773C5.93418 17.4801 5.93418 17.0052 6.22707 16.7123L10.9394 12L6.22707 7.28769C5.93418 6.9948 5.93418 6.51992 6.22707 6.22703Z" fill="#535353"/>\n' +
  '</svg>'

div.append(headline, button, closeButton);

if (!isMobile) {
  div.addEventListener('mouseenter', () => {
    button.style.display = "block";
    headline.style.display = "none";
  })
  div.addEventListener('mouseleave', () => {
    button.style.display = "none";
    headline.style.display = "block";
  })
} else {
  div.addEventListener("click", () => {
    button.style.display = "block";
    headline.style.display = "none";
  })
}

button.addEventListener("click", () => {
  ym(215233, "reachGoal", "entry_point", {
    name_stock: {
      den_molodezhi: {
        name_point: "main_page",
      }
    }
  });
  window.open('/info-actions/den-molodezhi/', '_blank');
})
closeButton.addEventListener("click", () => {
  div.style.display = "none";
})
appendOnce(placeToInsert, div);
