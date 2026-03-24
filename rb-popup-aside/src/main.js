import './style.css';

(function () {
  'use strict';

  ym(215233, 'reachGoal', 'ng_pop_up_show');

  const D = `<div class="bf-label__icon js-bf-icon">
    Раннее <br>
бронирование <br>
от A до Я
</div>

<div class="bf-label__bg js-bf-bg">
    <div class="bf-label__popup js-bf-popup">
        <div class="bf-label__close js-bf-close" aria-label="Закрыть" role="button" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none"
                 aria-hidden="true" focusable="false">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M15.5672 0.544067C15.5677 0.544067 15.5681 0.544534 15.5691 0.545467L16.9155 1.89216C16.9165 1.89286 16.9167 1.89333 16.9169 1.89403C16.917 1.89449 16.917 1.89497 16.9169 1.89543C16.9169 1.89613 16.9165 1.8966 16.9155 1.89753L10.2007 8.61233L16.9155 15.3271C16.9165 15.3281 16.9167 15.3285 16.9169 15.3292C16.9171 15.3298 16.9171 15.3303 16.9169 15.3309C16.9169 15.3313 16.9165 15.3318 16.9155 15.3327L15.5688 16.6792C15.5681 16.6801 15.5677 16.6804 15.5672 16.6806C15.5667 16.6808 15.5661 16.6808 15.5656 16.6806C15.5649 16.6806 15.5644 16.6801 15.5635 16.6792L8.84866 9.9644L2.13386 16.6792C2.13293 16.6801 2.13246 16.6804 2.13176 16.6806C2.13123 16.6808 2.13066 16.6808 2.13012 16.6806C2.12966 16.6806 2.12919 16.6801 2.12826 16.6792L0.781796 15.3325C0.780862 15.3318 0.780629 15.3313 0.780395 15.3309C0.780233 15.3303 0.780233 15.3298 0.780395 15.3292C0.780395 15.3285 0.780862 15.3281 0.781796 15.3271L7.4966 8.61233L0.781796 1.89753C0.780862 1.8966 0.780629 1.89613 0.780395 1.89543C0.780233 1.8949 0.780233 1.89433 0.780395 1.8938C0.780395 1.89333 0.780862 1.89286 0.781796 1.89193L2.12849 0.545467C2.12919 0.544534 2.12966 0.5443 2.13012 0.544067C2.13066 0.543905 2.13123 0.543905 2.13176 0.544067C2.13246 0.544067 2.13293 0.544534 2.13386 0.545467L8.84866 7.26027L15.5635 0.545467C15.5644 0.544534 15.5649 0.5443 15.5656 0.544067C15.5661 0.543905 15.5667 0.543905 15.5672 0.544067Z"
                      fill="#535353"/>
            </svg>
        </div>

        <span class="bf-label__quote">Реклама. ООО "МирТурСервис" erid: 2W5zFHc5JX2</span>

        <img class="popup-visual" src="https://b2ccdn.coral.ru/content/popup-shild-rb-f2-visual.jpg">

        <div class="bf-label__info">
            <p class="bf-label__title">Раннее<br> бронирование<br> от A до Я</p>
            <p class="bf-label__text">
               Решайтесь на отдых без спешки и с выгодой до 50%
            </p>
            <a href="https://www.sunmar.ru/info-actions/december-january/" class="bf-label__button js-bf-button"
               target="_blank" rel="noopener">Выбрать тур</a>
        </div>
    </div>
</div>
`;

  function l(i, o) {
    return i.querySelector(o)
  }

  function w(i, ...o) {
    typeof window.ym == "function" && window.ym(i, ...o);
  }

  (function ({target: i = document.body, counters: o = {popup: 96674199, entry: 215233}, breakpoint: g = 768} = {}) {
    const e = document.createElement("div");
    e.className = "bf-label", e.innerHTML = D, i.appendChild(e);
    const t = l(e, ".js-bf-icon"), s = l(e, ".js-bf-popup"), r = l(e, ".js-bf-bg"), c = l(e, ".js-bf-close"),
      b = l(e, ".js-bf-button"), p = () => w(o.popup, "reachGoal", "popupShow"),
      y = () => w(o.entry, "reachGoal", "entry_point", {name_stock: {EB_landing: {name_point: "pop_up"}}}), v = () => {
        s.classList.add("visible"), t.classList.add("hiddeny"), e.classList.add("hiddeny"), s.classList.remove("on-hide"), p();
      }, m = () => {
        s.classList.remove("visible"), t.classList.remove("hiddeny"), e.classList.remove("hiddeny"), s.classList.add("on-hide");
      }, u = () => {
        s.classList.add("visible"), r.classList.add("visible"), t.classList.add("hiddeny"), e.classList.add("hiddeny"), document.body.classList.add("js-scroll-lock"), s.classList.remove("on-hide"), p();
      }, E = () => {
        s.classList.remove("visible"), r.classList.remove("visible"), t.classList.remove("hiddeny"), e.classList.remove("hiddeny"), document.body.classList.remove("js-scroll-lock"), s.classList.add("on-hide");
      }, a = n => {
        n.preventDefault(), E();
      }, L = n => {
        (n.key === "Enter" || n.key === " ") && a(n);
      }, j = () => {
        t.addEventListener("mouseenter", v), s.addEventListener("mouseleave", m);
      }, f = () => {
        t.removeEventListener("mouseenter", v), s.removeEventListener("mouseleave", m);
      }, M = () => {
        t.addEventListener("click", u), c.addEventListener("click", a), c.addEventListener("keydown", L);
      }, h = () => {
        t.removeEventListener("click", u), c.removeEventListener("click", a), c.removeEventListener("keydown", L);
      }, d = window.matchMedia(`(max-width:${g}px)`), C = n => {
        f(), h(), n ? M() : j();
      }, _ = n => C(n.matches);
    C(d.matches), d.addEventListener("change", _);
    const k = n => {
      n.preventDefault(), y();
      const x = n.currentTarget.href;
      window.open(x, "_blank", "noopener");
    };
    return b.addEventListener("click", k), {
      root: e, unmount: () => {
        d.removeEventListener("change", _), f(), h(), b.removeEventListener("click", k), e.remove();
      }
    }
  })();
})();
