(t => {
  if (typeof GM_addStyle == "function") {
    GM_addStyle(t);
    return
  }
  const e = document.createElement("style");
  e.textContent = t, document.head.append(e)
})(".push-noty{box-sizing:border-box;font-size:16px;position:fixed;top:23px;left:7%;background:#6a71ee;display:grid;grid-template-columns:min-content auto;font-family:Museo_Sans,Museo_Sans_Cyrill,sans-serif;z-index:1000;color:#fff;padding:1.25em;border-radius:1.25em;gap:1.25em;width:100%;max-width:400px;box-shadow:#959da533 0 8px 24px}@media (max-width: 993px){.push-noty{left:50%;width:calc(100% - 24px);transform:translate(-50%)}}@media (max-width: 450px){.push-noty{grid-template-columns:1fr}}.push-noty__visual{width:5.8em;height:100%;display:flex;align-items:center;align-self:center}@media (max-width: 450px){.push-noty__visual{position:absolute;right:1.25em;top:1.25em;height:auto;width:3em;align-items:start}}.push-noty__content{display:flex;flex-direction:column;justify-content:center;gap:.8em;line-height:1}.push-noty__headline{font-size:1em;margin:0;font-weight:600}@media (max-width: 450px){.push-noty__headline{padding-right:6.5em}}.push-noty__message{font-size:.75em;line-height:18px;font-weight:400}@media (max-width: 450px){.push-noty__message{padding-right:6.5em}}.push-noty .action-buttons{display:flex;gap:1em}.push-noty .action-buttons__button{margin:0;text-align:center;font-size:.75em;border-radius:3.5em;text-decoration:none;cursor:pointer;background:transparent;padding:1em 1.5em;border:none;flex:1 1 auto;min-width:6.75em;line-height:1;transition:all .3s ease}.push-noty .action-buttons__button--submit{background:var(--gradient_Primary, linear-gradient(245deg, var(--Gradient-color_Gradinet_Primary_Second, #D8242A) 15.84%, var(--Gradient-color_Gradient_Primary_First, #E7317D) 84.16%));color:#fff}@media (hover: hover){.push-noty .action-buttons__button--submit:hover{background:var(--gradient_Primary_Hover, linear-gradient(245deg, var(--Gradient-color_Gradient_Primary_First, #E7317D) 15.84%, var(--Gradient-color_Gradinet_Primary_Second, #D8242A) 84.16%))}}.push-noty .action-buttons__button--submit:active{background:var(--Button-color_Btn_Bg_Primary_Pressed, #C11117)}.push-noty .action-buttons__button--close{background:#fff;color:#000}@media (hover: hover){.push-noty .action-buttons__button--close:hover{background:#f5f5f8}}.push-noty .action-buttons__button--close:active{background:#dfdfe8}.push-noty.mobile{width:95%;left:50%;transform:translate(-50%);font-size:12px;box-shadow:#64646f33 0 7px 29px}.push-noty.mobile:after{display:none}.js-hidden{display:none}");

(function () {
  'use strict'

  // === Конфигурация ===
  const CONFIG = {
    delay: 2000,
    bannerTTL: 7 * 24 * 60 * 60 * 1000, // 7 дней
    localStorageKeys: {
      subscribed: 'notificationAccepted',
      shown: 'notificationShown',
      uuid: 'mindboxDeviceUUID',
    }
  }

  // === Вставка HTML один раз ===
  function insertOnce(target, position, html, id) {
    const attr = target.hasAttribute("data-inserted");
    const attrValue = target.getAttribute("data-inserted");
    if (attr && attrValue === id) return;
    target.insertAdjacentHTML(position, html);
    target.setAttribute("data-inserted", id);
  }

  const markup = '<div class="push-noty js-hidden">\n    <div class="push-noty__visual">\n        <img src="https://b2ccdn.sunmar.ru/content/push_icon_2025_2.png">\n    </div>\n    <div class="push-noty__content">\n        <h3 class="push-noty__headline">Новинки и акции для вас</h3>\n        <div class="push-noty__message">\n            Подпишитесь на&nbsp;уведомления и&nbsp;первыми узнавайте о&nbsp;выгодных предложениях\n        </div>\n        <div class="push-noty__actions action-buttons">\n            <button type="button" class="action-buttons__button action-buttons__button--close close-btn">Не сейчас\n            </button>\n            <button type="button"\n                    class="action-buttons__button action-buttons__button--submit">Подписаться\n            </button>\n        </div>\n    </div>\n</div>\n';

  insertOnce(document?.body, 'beforeend', markup, 'push-noty')

  // === Хранилище с TTL ===
  const storageWithTTL = {
    set: (key, value, ttl) => {
      try {
        const data = ttl
          ? {value, expiresAt: Date.now() + ttl}
          : {value};
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    get: key => {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return undefined;
      try {
        const data = JSON.parse(itemStr);
        if (!('expiresAt' in data) || Date.now() < data.expiresAt) {
          return data.value;
        }
        localStorage.removeItem(key);
        return undefined;
      } catch {
        localStorage.removeItem(key);
        return undefined;
      }
    },
    remove: key => localStorage.removeItem(key),
  };

  // === DOM элементы ===
  const push = document?.querySelector('.push-noty')
  const declineButton = document?.querySelector('.action-buttons__button--close')
  const acceptButton = document?.querySelector('.action-buttons__button--submit')

  // === Логика показа ===
  const uid = localStorage.getItem(CONFIG.localStorageKeys.uuid)
  const hasUserConsented = storageWithTTL.get(CONFIG.localStorageKeys.subscribed)
  const hasPermission = Notification.permission
  const bannerAlreadyShown = storageWithTTL.get(CONFIG.localStorageKeys.shown)

  const isExecute = !hasUserConsented && hasPermission === 'default' && !bannerAlreadyShown

  function showBanner() {
    if (!push) return
    push.classList.remove('js-hidden')
    ym(215233, "reachGoal", "show_push");
  }

  function hideNotification() {
    push && push.classList.add('js-hidden')
    ym(215233, "reachGoal", "click_push", {"click": "yes"});
  }

  function hideNotificationTemporarily() {
    hideNotification()
    storageWithTTL.set(
      CONFIG.localStorageKeys.subscribed,
      false,
      CONFIG.bannerTTL
    )
    storageWithTTL.set(
      CONFIG.localStorageKeys.shown,
      true,
      CONFIG.bannerTTL
    )
    ym(215233, "reachGoal", "click_push", {"click": "no"});
  }

  function initSubscription() {
    if (!uid) return
    mindbox('webpush.subscribe', {
      onGranted: () => {
        storageWithTTL.set(CONFIG.localStorageKeys.subscribed, true)
        hideNotification()
      },
      onDenied: () => hideNotificationTemporarily(),
    })
  }


  // === Обработка кликов
  declineButton.addEventListener('click', () => hideNotificationTemporarily())
  acceptButton.addEventListener('click', () => initSubscription())

  // === Показ баннера с задержкой
  if (isExecute) {
    setTimeout(() => showBanner(), CONFIG.delay)
  }
})();
