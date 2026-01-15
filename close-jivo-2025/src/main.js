import {SimpleReactDomObserver, waitUntilElementsGone} from '../../utils.js';
import closeBtnHTML from './button.html?raw';
import jivoHintHTML from './banner.html?raw';
import './styles/styles.css';

const STORAGE_KEY = 'jivo_hidden_until';
const SESSION_KEY = 'jivo_hidden_session';
const JIVO_BUTTON_SELECTOR = 'jdiv[class^="button__"]';
const JIVO_ROOT_SELECTOR = 'jdiv[class*="_orientationRight"]';
const HINT_ID = 'jivo-hint-modal';
const HINT_CLOSE_SELECTOR = '.jivo-close-btn';
const GALYA_OTMENA = '.banner-close-btn';
const HINT_DELAY_SELECTOR = '[data-delay]';
const HINT_SESSION_SELECTOR = '[data-session]';
const MINUTES = 10;
const BODY_HIDDEN_CLASS = 'jivo-hidden';

// --- трекинг
function trackGoal(name, params) {
  if (typeof ym === 'function') {
    ym(96674199, 'reachGoal', name, params);
  }
}

// --- storage

function hideForMinutes(minutes) {
  const until = Date.now() + minutes * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, String(until));
}

function hideForSession() {
  sessionStorage.setItem(SESSION_KEY, '1');
}

function hasActiveCooldown() {
  // до конца сессии
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    return true;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  const until = Number(raw);

  // битое значение — очищаем
  if (!Number.isFinite(until)) {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }

  // ещё не истёк — скрываем
  if (Date.now() < until) {
    return true;
  }

  // срок прошёл — чистим ключ
  localStorage.removeItem(STORAGE_KEY);
  return false;
}

// --- show / hide через body класс

function hideJivo() {
  document.body.classList.add(BODY_HIDDEN_CLASS);
}

function showJivo() {
  document.body.classList.remove(BODY_HIDDEN_CLASS);
}

// та самая логика: есть записи → hide, иначе show
function updateJivoVisibility() {
  if (hasActiveCooldown()) {
    hideJivo();
  } else {
    showJivo();
  }
}

// --- UI кнопки

function initCloseBtn(btn) {
  if (!btn || btn.dataset.jivoCloseInit === 'true') return;

  btn.dataset.jivoCloseInit = 'true';
  btn.setAttribute('mindbox-custom', 'true');
  btn.insertAdjacentHTML('beforebegin', String(closeBtnHTML));
}

function ensureHintExists() {
  if (!document.getElementById(HINT_ID)) {
    document.body.insertAdjacentHTML('beforeend', String(jivoHintHTML));
  }
}

function getJivoRoot(btn) {
  // теперь по сути нужен только для побочных задач
  return btn?.parentElement?.parentElement ||
    document.querySelector(JIVO_ROOT_SELECTOR);
}

// --- баннер-хинт

function showHint(hint) {
  if (!hint) return;
  hint.classList.remove('js-none');
  void hint.offsetWidth;
  hint.classList.add('js-anim');
}

function hideHint(hint) {
  if (!hint) return;

  hint.classList.remove('js-anim');

  const onEnd = () => {
    hint.classList.add('js-none');
    hint.removeEventListener('transitionend', onEnd);
    clearTimeout(fallback);
  };

  const fallback = setTimeout(onEnd, 400);

  hint.addEventListener('transitionend', onEnd);
}

function bindHintLogic(btn) {
  ensureHintExists();

  const hint = document.getElementById(HINT_ID);
  const closeBtn = document.querySelector(HINT_CLOSE_SELECTOR);

  if (!hint || !closeBtn) return;

  const delayBtn = hint.querySelector(HINT_DELAY_SELECTOR);
  const sessionBtn = hint.querySelector(HINT_SESSION_SELECTOR);
  const otmenaBtn = hint.querySelector(GALYA_OTMENA) || document.querySelector(GALYA_OTMENA);

  // "на 10 минут"
  if (delayBtn && !delayBtn.dataset.bound) {
    delayBtn.dataset.bound = 'true';
    delayBtn.addEventListener('click', () => {
      hideHint(hint);
      trackGoal('jivo_close', {period: 'delay'});

      hideForMinutes(MINUTES);
      updateJivoVisibility();
    });
  }

  // "до конца сессии"
  if (sessionBtn && !sessionBtn.dataset.bound) {
    sessionBtn.dataset.bound = 'true';
    sessionBtn.addEventListener('click', () => {
      hideHint(hint);
      trackGoal('jivo_close', {period: 'forever'});

      hideForSession();
      updateJivoVisibility();
    });
  }

  // "отмена"
  if (otmenaBtn && !otmenaBtn.dataset.bound) {
    otmenaBtn.dataset.bound = 'true';
    otmenaBtn.addEventListener('click', () => {
      hideHint(hint);
    });
  }

  // кнопка на виджете, открывающая баннер
  if (!closeBtn.dataset.bound) {
    closeBtn.dataset.bound = 'true';
    closeBtn.addEventListener('click', () => {
      showHint(hint);
    });
  }
}

// --- Observer

new SimpleReactDomObserver(JIVO_BUTTON_SELECTOR, {
  onAppear: (btn) => {
    if (!btn) return;

    const wrap = btn.parentElement;
    let oldDisplay = '';

    if (wrap) {
      oldDisplay = wrap.style.display;
      wrap.style.display = 'none';
    }

    // сразу применяем текущее состояние (на случай, если виджет успел подгрузиться)
    updateJivoVisibility();

    // ждём, пока исчезнут блокирующие попапы
    waitUntilElementsGone(
      {required: ['.cookie-agreement-content', '.departureCityPopupModal']},
      () => {
        if (wrap) {
          wrap.style.display = oldDisplay || '';
        }
        // ещё раз синхронизируем
        updateJivoVisibility();
      }
    );

    initCloseBtn(btn);
    bindHintLogic(btn);
  },
}).start();
