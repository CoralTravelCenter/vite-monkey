import './style.css'

const NEXT_ID = 'Proxy_Next_Button';
const BACK_ID = 'Proxy_Back_Button';
let observerStarted = false;

/* ================= utils ================= */

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

/* ================= init ================= */

function init(step) {
  console.log('+++ Init', step);

  const productSummary = document.querySelector('.product-summary');
  if (!productSummary) return;

  const originalNext = document.getElementById('SaveReservation_Button');
  const originalBack = document.querySelector('.back-btn');

  /* ---------- NEXT ---------- */

  const nextBtn = ensureButton(
    NEXT_ID,
    'ab-test-btn ant-btn css-1dzkrh8 ant-btn-primary ant-btn-color-primary ant-btn-variant-solid ant-btn-lg text-bold'
  );

  if (!productSummary.contains(nextBtn)) {
    productSummary.appendChild(nextBtn);
  }

  if (step.includes('step=0')) {
    nextBtn.textContent = 'Перейти к бронированию';
    nextBtn.style.display = '';
    hide(originalNext);

    attachOnce(nextBtn, () => originalNext && originalNext.click());

  } else if (step.includes('step=1')) {
    nextBtn.textContent = 'Перейти к данным туристов';
    nextBtn.style.display = '';
    hide(originalNext);

    attachOnce(nextBtn, () => originalNext && originalNext.click());

  }

  /* ---------- BACK ---------- */

  const backBtn = ensureButton(
    BACK_ID,
    'ab-test-btn ant-btn css-1dzkrh8 ant-btn-default ant-btn-color-default ant-btn-variant-outlined ant-btn-lg text-bold text-black'
  );

  if (!productSummary.contains(backBtn)) {
    productSummary.appendChild(backBtn);
  }

  if (step.includes('step=1')) {
    backBtn.textContent = 'Вернуться к выбору услуг';
    hide(originalBack);

    attachOnce(backBtn, () => originalBack && originalBack.click());

  } else {
    backBtn.style.display = 'none';
  }
}

/* ================= observer ================= */

function watchProductSummary() {
  if (observerStarted) return;
  observerStarted = true;

  const observer = new MutationObserver(() => {
    const productSummary = document.querySelector('.product-summary');
    if (!productSummary) return;

    const next = document.getElementById(NEXT_ID);
    const back = document.getElementById(BACK_ID);

    if (
      (next && !productSummary.contains(next)) ||
      (back && !productSummary.contains(back))
    ) {
      init(location.search);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/* ================= start ================= */

init(location.search);
watchProductSummary();

CoralRouteBus.subscribe(() => {
  init(location.search);
});
