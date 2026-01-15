import markup from './markup.coral.html?raw'
import './style.coral.scss'
import {getLocalStorageWithExpiry, insertOnce, setLocalStorageWithExpiry, waitUntilElementsGone} from "../../utils.js";

insertOnce(document.body, 'beforeend', markup, 'push-noty')

const DELAY = 1500;
const PUSH_STORAGE_KEY = "pushShowedToUser";

const uid = localStorage.getItem("mindboxDeviceUUID");
const token = getLocalStorageWithExpiry(PUSH_STORAGE_KEY);
const isRegistered = localStorage.getItem("webpushSubscribeActive");
const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const push = document?.querySelector('.push-noty');
const closeBtn = document?.querySelector('.close-btn');
const submitBtn = document?.querySelector('.action-buttons__button--submit');

if (push && isMobile) {
  push.classList.add('mobile');
}

// Проверка: пуш еще не показан и клиент не зарегистрирован
const shouldShowNotification = !token && !isRegistered;

function trackGoal(name, params) {
  if (typeof ym === 'function') {
    ym(96674199, 'reachGoal', name, params);
  }
}

waitUntilElementsGone(
  {
    required: ['.cookie-agreement-content', '.departureCityPopupModal'],
    floating: ['#welcome-to-app-popup']
  },
  () => {


    if (!push) return;

    // Показываем пуш с задержкой
    if (shouldShowNotification) {
      setTimeout(() => {
        push.classList.remove('js-hidden')
        trackGoal('show_push')
      }, DELAY);
    }

    // Закрытие уведомления на неделю
    function hideNotificationPerWeek() {
      push.classList.add('js-hidden');
      setLocalStorageWithExpiry(PUSH_STORAGE_KEY, "true", 7);
    }

    // Закрытие уведомления навсегда (в рамках текущего клиента)
    function hideNotification() {
      push.classList.add('js-hidden');
    }

    // Отправка данных клиента в Mindbox
    function clientInit() {
      if (!uid) return;

      mindbox("webpush.subscribe", {
        onGranted: function () {
          localStorage.setItem("webpushSubscribeActive", "true");
          hideNotification();
        },
        onDenied: function () {
          hideNotificationPerWeek();
        }
      });
    }

    // Обработчики событий
    closeBtn?.addEventListener('click', hideNotificationPerWeek);
    submitBtn?.addEventListener('click', clientInit);
  }
);
