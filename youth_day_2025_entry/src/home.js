import home from "./home/home.html?raw";
import './home/home.css'
import {appendOnce} from "../../utils.js";

const placeToInsert = document.querySelector("#quick-search-tab-area + div .swiper");

const link = document.createElement("a")
link.id = "youth_day_2025_entry";
link.innerHTML = home;
link.addEventListener("click", e => {
  e.preventDefault();
  window.open('/info-actions/den-molodezhi/', '_blank');
})
appendOnce(placeToInsert, link);
