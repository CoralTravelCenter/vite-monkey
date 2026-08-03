import markup from "./markup.html?raw";
import mobileMarkup from "./markup-mobile.html?raw";
import "./style.scss";
import { insertOnce, loadScript, watchIntersection } from "@utils";

insertOnce(document.body, "beforeend", mobileMarkup, "ball");

function getRandomElement(array) {
  if (array.length === 0) {
    return null; // Возвращаем null, если массив пустой
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

async function vimeoAutoPlay(observer_options = {}) {
  const vboxes = document.querySelectorAll(".vimeo-video-box [data-vimeo-vid]");
  if (vboxes.length) {
    await loadScript("https://player.vimeo.com/api/player.js", {
      removeAfterLoad: true,
    });
    watchIntersection(
      vboxes,
      { threshold: 0.33, ...observer_options },
      (target) => {
        if (!target["vimeo-player"]) {
          target["vimeo-player"] = new Vimeo.Player(target, {
            id: target.dataset.vimeoVid,
            background: 1,
            playsinline: 1,
            autopause: 0,
            title: 0,
            byline: 0,
            portrait: 0,
            autoplay: 1,
            muted: 1,
          });
          target["vimeo-player"].on("play", function () {
            this.element.parentElement.classList.add("playback");
          });
        }
        target["vimeo-player"].play();
      },
      (target) => target["vimeo-player"]?.pause(),
    );
  }
}

const blob = document.querySelector("#magic-ball");
const content = document.querySelector("#magic-ball .content");
const closeBtn = document.querySelector("#magic-ball .close");
const predskazanieArr = [
  {
    name: "Саркофагия",
    description: "Мумии тут живут дольше,<br> чем твои отпускные деньги.",
  },
  {
    name: "Шейхбург",
    description: "Место, где роскошь - это стандарт,<br> а не опция",
  },
  {
    name: "Тукополис",
    description: "Каждая поездка - как мини-квест<br> на выживание.",
  },
  {
    name: "Фотошопия",
    description: "Место, где фильтры не нужны,<br> всё уже идеально.",
  },
  {
    name: "Нефтистан",
    description: "Когда бензин дешевле воды,<br> но пьют всё равно кофе.",
  },
  {
    name: "Цейлонбург",
    description: "Место, где даже воздух<br> с ароматом чая.",
  },
  {
    name: "Фобошная",
    description: "Место, где суп<br> - это целая философия.",
  },
];

vimeoAutoPlay();

closeBtn.addEventListener("click", () => {
  blob.style.display = "none";
  ym(96674199, "reachGoal", "ball", { click: "close" });
});

content.addEventListener("click", (e) => {
  ym(96674199, "reachGoal", "ball", { click: "open" });
  insertOnce(document.body, "beforeend", markup, "popup");
  document.body.style.overflow = "hidden";

  const joke = document.querySelector("#magic-ball-popup .joke");
  const fakeText = document.querySelector(".fake-text");
  const link = document.querySelector("#go-to-promopage");
  const fakeCountry = document.querySelector("#magic-ball-popup .fake-country");
  const predskazanie = document.querySelector(
    "#magic-ball-popup .predskazanie",
  );
  const { name, description } = getRandomElement(predskazanieArr);
  fakeCountry.innerHTML = name;
  fakeText.innerHTML = description;

  blob.classList.add("no-events");

  setTimeout(() => {
    predskazanie.classList.add("visible");
  }, 200);

  setTimeout(() => {
    predskazanie.classList.remove("visible");
    joke.classList.add("visible");

    link.addEventListener("click", function (e) {
      e.stopPropagation();
      const yaParams = {
        name_stock: {
          "1_april": {
            name_point: location.pathname === "/" ? "main_page" : "promo_page",
          },
        },
      };
      ym(96674199, "reachGoal", "entry-point", yaParams);
      document.body.style.overflow = "auto";
      document.querySelector("#magic-ball-popup").remove();
    });
  }, 3000);
});
