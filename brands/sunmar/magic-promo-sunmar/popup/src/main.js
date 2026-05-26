import html from './markup.html?raw';
import './style.css';

function qs(root, sel) {
  return root.querySelector(sel);
}

function safeYm(id, ...rest) {
  if (typeof window.ym === 'function') {
    window.ym(id, ...rest);
  }
}

(function (
  {
    target = document.body,
    counters = {popup: 96674199, entry: 215233},
    breakpoint = 768,
  } = {}) {
  // 1) Корневой контейнер
  const root = document.createElement('div');
  root.className = 'bf-label';
  root.innerHTML = html;
  target.appendChild(root);

  // 2) Элементы
  const icon = qs(root, '.js-bf-icon');
  const popup = qs(root, '.js-bf-popup');
  const backdrop = qs(root, '.js-bf-bg');
  const closeBtn = qs(root, '.js-bf-close');
  const cta = qs(root, '.js-bf-button');

  // 3) Метрики
  const trackOpen = () => safeYm(counters.popup, 'reachGoal', 'popupShow');
  const trackEntry = () =>
    safeYm(counters.entry, 'reachGoal', 'entry_point', {
      name_stock: {ng_dec_jan: {name_point: 'pop_up'}},
    });

  // 4) Действия
  const openDesktop = () => {
    popup.classList.add('visible');
    icon.classList.add('hidden');
    root.classList.add('hidden');
    popup.classList.remove('on-hide');
    trackOpen();
  };
  const closeDesktop = () => {
    popup.classList.remove('visible');
    icon.classList.remove('hidden');
    root.classList.remove('hidden');
    popup.classList.add('on-hide');
  };

  const openMobile = () => {
    popup.classList.add('visible');
    backdrop.classList.add('visible');
    icon.classList.add('hidden');
    root.classList.add('hidden');
    document.body.classList.add('js-scroll-lock');
    popup.classList.remove('on-hide');
    trackOpen();
  };
  const closeMobile = () => {
    popup.classList.remove('visible');
    backdrop.classList.remove('visible');
    icon.classList.remove('hidden');
    root.classList.remove('hidden');
    document.body.classList.remove('js-scroll-lock');
    popup.classList.add('on-hide');
  };

  // 5) Обработчики
  const onCloseClick = (e) => {
    e.preventDefault();
    closeMobile();
  };

  const onCloseKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') onCloseClick(e);
  };

  const bindDesktop = () => {
    icon.addEventListener('mouseenter', openDesktop);
    popup.addEventListener('mouseleave', closeDesktop);
  };
  const unbindDesktop = () => {
    icon.removeEventListener('mouseenter', openDesktop);
    popup.removeEventListener('mouseleave', closeDesktop);
  };

  const bindMobile = () => {
    icon.addEventListener('click', openMobile);
    closeBtn.addEventListener('click', onCloseClick);
    closeBtn.addEventListener('keydown', onCloseKey);
  };
  const unbindMobile = () => {
    icon.removeEventListener('click', openMobile);
    closeBtn.removeEventListener('click', onCloseClick);
    closeBtn.removeEventListener('keydown', onCloseKey);
  };

  // 6) Режимы (desktop/mobile)
  const mql = window.matchMedia(`(max-width:${breakpoint}px)`);
  const applyMode = (mobile) => {
    unbindDesktop();
    unbindMobile();
    if (mobile) bindMobile();
    else bindDesktop();
  };
  const onMqlChange = (e) => applyMode(e.matches);

  applyMode(mql.matches);
  mql.addEventListener('change', onMqlChange);

  // 7) CTA
  const onCta = (evt) => {
    evt.preventDefault();
    trackEntry();
    const href = evt.currentTarget.href;
    window.open(href, '_blank', 'noopener');
  };
  cta.addEventListener('click', onCta);

  // 8) API снятия
  const unmount = () => {
    mql.removeEventListener('change', onMqlChange);
    unbindDesktop();
    unbindMobile();
    cta.removeEventListener('click', onCta);
    root.remove();
  };

  return {root, unmount};
})()
