import './style.css'

const NEXT_ID = 'Proxy_Next_Button';
const BACK_ID = 'Proxy_Back_Button';

let observerStarted = false;

const SELECTORS = {
  productSummary: '.product-summary',
  originalNext: '#SaveReservation_Button',
  originalBack: '.back-btn',
};

const CLASSES = {
  next: 'ab-test-btn ant-btn css-1dzkrh8 ant-btn-primary ant-btn-color-primary ant-btn-variant-solid ant-btn-lg text-bold',
  back: 'ab-test-btn ant-btn css-1dzkrh8 ant-btn-default ant-btn-color-default ant-btn-variant-outlined ant-btn-lg text-bold text-black',
};

function getStep(search = location.search) {
  return new URLSearchParams(search).get('step') || '';
}

function ensureButton(id, className) {
  let btn = document.getElementById(id);
  if (!btn) {
    btn = document.createElement('button');
    btn.id = id;
    btn.className = className;
  }
  return btn;
}

function attachOnce(btn, handler) {
  if (btn.__onClick) btn.removeEventListener('click', btn.__onClick);
  btn.__onClick = handler;
  btn.addEventListener('click', handler);
}

function hide(el) {
  if (!el) return;
  el.style.display = 'none';
  el.setAttribute('aria-hidden', 'true');
}

function show(el, display = '') {
  if (!el) return;
  el.style.display = display;
  el.removeAttribute('aria-hidden');
}

function mount(container, el) {
  if (!container || !el) return;
  if (!container.contains(el)) container.appendChild(el);
}

function render(search = location.search) {
  const productSummary = document.querySelector(SELECTORS.productSummary);
  if (!productSummary) return;

  const step = getStep(search);

  const originalNext = document.querySelector(SELECTORS.originalNext);
  const originalBack = document.querySelector(SELECTORS.originalBack);

  // NEXT
  const nextBtn = ensureButton(NEXT_ID, CLASSES.next);
  mount(productSummary, nextBtn);

  if (step === '0') {
    nextBtn.textContent = 'Перейти к бронированию';
  } else if (step === '1') {
    nextBtn.textContent = 'Заполнить данные туристов';
  } else if (step === '2') {
    nextBtn.textContent = 'Забронировать';
  }

  show(nextBtn);
  hide(originalNext);
  attachOnce(nextBtn, () => originalNext?.click());

  // BACK
  const backBtn = ensureButton(BACK_ID, CLASSES.back);
  mount(productSummary, backBtn);

  if (step === '1') {
    backBtn.textContent = 'Вернуться к выбору услуг';
    show(backBtn, 'block');
    hide(originalBack);
    attachOnce(backBtn, () => originalBack?.click());
  } else if (step === '2') {
    backBtn.textContent = 'Назад к данным заказчика';
    show(backBtn, 'block');
    hide(originalBack);
    attachOnce(backBtn, () => originalBack?.click());
  } else {
    hide(backBtn);
  }
}

function scheduleRender() {
  let tries = 0;
  const MAX_TRIES = 5;

  const tick = () => {
    const productSummary = document.querySelector(SELECTORS.productSummary);
    if (productSummary) {
      render(location.search);
      return;
    }

    if (++tries < MAX_TRIES) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

function watchProductSummary() {
  if (observerStarted) return;
  observerStarted = true;

  const observer = new MutationObserver(() => {
    const productSummary = document.querySelector(SELECTORS.productSummary);
    if (!productSummary) return;

    const next = document.getElementById(NEXT_ID);
    const back = document.getElementById(BACK_ID);

    const nextMissing = !next || !productSummary.contains(next);
    const backMissing = !back || !productSummary.contains(back);

    if (nextMissing || backMissing) {
      render(location.search);
    }
  });

  observer.observe(document.body, {childList: true, subtree: true});
}

// init
scheduleRender();
watchProductSummary();

CoralRouteBus.subscribe(() => {
  scheduleRender();
  watchProductSummary();
});
