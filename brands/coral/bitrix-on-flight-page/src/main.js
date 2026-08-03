(t => {
  if (typeof GM_addStyle == "function") {
    GM_addStyle(t);
    return
  }
  const e = document.createElement("style");
  e.textContent = t, document.head.append(e)
})(" .lead-form-bitrix-toogle{border-radius:16px;border:1px solid #077DAD;background:#ecf3f9;padding:8px;display:flex;justify-content:space-between;align-items:center;font-size:14px;margin-block:10px}.lead-form-bitrix-toogle>span{vertical-align:center}.b24-form-click-btn{padding:8px 12px!important;border-radius:12px!important;background:#0092d0!important;color:#fff!important;font-size:14px!important;font-weight:400!important} ");

(function () {
  'use strict';

  const scriptInner = "(function (w, d, u) {\nconst s = d.createElement('script')\ns.async = true\ns.src = u + '?' + ((Date.now() / 180000) | 0)\nconst h = d.getElementsByTagName('script')[0]\nh.parentNode.insertBefore(s, h)\n})\n(\nwindow,\ndocument,\n'https://cdn-ru.bitrix24.ru/b9730187/crm/form/loader_414.js'\n)";

  async function waitSelector(selector, timeout = 200) {
    return new Promise((resolve) => {
      const waiter = () => {
        const host_el = document.querySelector(selector);
        if (host_el) {
          resolve();
        } else {
          setTimeout(waiter, timeout);
        }
      };
      waiter();
    });
  }

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function createLeadFormBlock() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("lead-form-bitrix-toogle");
    wrapper.id = "lead-form-bitrix-toggle";
    const span = document.createElement("span");
    span.textContent = "Оформим тур за вас! 💬";
    const script = document.createElement("script");
    script.setAttribute("data-b24-form", "click/414/m4q4ey");
    script.setAttribute("data-skip-moving", "true");
    script.innerHTML = scriptInner;
    wrapper.append(span, script);
    return wrapper;
  }

  function prependOnceLeadForm(container) {
    if (!document.querySelector("#lead-form-bitrix-toggle")) {
      container.prepend(createLeadFormBlock());
    }
  }

  if (isMobileDevice()) {
    waitSelector('#package-tour-flight-hotel-overview-heading-area').then(() => {
      const container = document.querySelector("#package-tour-flight-hotel-overview-heading-area");
      if (container) {
        prependOnceLeadForm(container);
      }
      waitSelector(".b24-form-click-btn").then(() => {
        const btn = document.querySelector(".b24-form-click-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            ym(96674199, 'reachGoal', 'request')
          });
        }
      });
    });
  }
})();
