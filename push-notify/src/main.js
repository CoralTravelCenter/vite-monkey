import markup from './markup.sumar.html?raw'
import './styles.sunmar.scss'
import {getLocalStorageWithExpiry, insertOnce, setLocalStorageWithExpiry} from "../../utils.js";

insertOnce(document.body, 'beforeend', markup)

const DELAY = 2000;
const uid = localStorage.getItem("mindboxDeviceUUID");
const token = getLocalStorageWithExpiry("pushShowedToUser");
const isRegistered = localStorage.getItem("webpushSubscribeActive");
const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const push = document?.querySelector('.push-noty');
const closeBtn = document?.querySelector('.close-btn');
const submitBtn = document?.querySelector('.action-buttons__button--submit');

if (isMobile) push.classList.add('mobile');

// Проверка: пуш еще не показан и клиент не зарегистрирован
const shouldShowNotification = !token && !isRegistered;

// Показываем пуш с задержкой
if (shouldShowNotification) {
  setTimeout(() => {
    push.classList.remove('js-hidden')
    ym(96674199, 'reachGoal', 'show_push')
  }, DELAY);
}

// Закрытие уведомления на неделю
function hideNotificationPerWeek() {
  push.classList.add('js-hidden');
  setLocalStorageWithExpiry("popupWasShowed", "true", 7);
}

// Закрытие уведомления навсегда
function hideNotification() {
  push.classList.add('js-hidden');
}

// Отправка данных клиента в Mindbox
function clientInit() {
  if (!uid) return;

  mindbox("webpush.subscribe", {
    onGranted: function () {
      // Если пользвотель подписался - скрываем блок навсегда
      localStorage.setItem("webpushSubscribeActive", "true");
      hideNotification()
    },
    onDenied: function () {
      // Если пользвотель отказался - скрываем на неделю
      hideNotificationPerWeek()
    }
  });
}

// Обработчики событий
closeBtn?.addEventListener('click', hideNotificationPerWeek);
submitBtn?.addEventListener('click', () => clientInit());
