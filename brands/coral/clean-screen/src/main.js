import {ReactDomObserver} from "../../utils.js";

const BLOCKERS = [
  '.cookie-agreement-content',
  'div[class*="DepartureCitySelectModal"]',
];

// Идемпотентный апдейтер состояния + эмит события
const setIsClear = (() => {
  let prev;
  return (isClear) => {
    if (prev === isClear) return; // ничего не делаем, если без изменений
    prev = isClear;
    window._isClearScreen = isClear;
    document.dispatchEvent(
      new CustomEvent('clearScreenChange', {detail: isClear})
    );
  };
})();

// true — если ни один блокер не найден
const computeIsClear = () =>
  !BLOCKERS.some((sel) => document.querySelector(sel));

// Дебаунс на один кадр, чтобы схлопывать серии мутаций
const scheduleRecompute = (() => {
  let raf = 0;
  return () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      setIsClear(computeIsClear());
    });
  };
})();

// Наблюдатель сразу за всеми селекторами
new ReactDomObserver(BLOCKERS, {
  onAppear: scheduleRecompute,
  onDisappear: scheduleRecompute,
  // debug: true,
}).start();

// Первичная синхронизация при подключении скрипта
setIsClear(computeIsClear());


// document.addEventListener('clearScreenChange', (e) => {
//   console.log('Экран?', e.detail);
// });
