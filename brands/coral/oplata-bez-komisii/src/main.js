function addCustomTextToCard(cardEl) {
  const content = cardEl.querySelector('div[class*="PaymentMethodCard_content"]');
  if (!content) return;

  if (content.querySelector('.custom-text')) return;

  const span = document.createElement('span');
  span.className = 'custom-text';
  span.style.marginTop = '4px';
  span.innerHTML = '<strong>При оплате этим способом комиссия 0₽</strong>';

  content.appendChild(span);
}

function updateAllCards() {
  const cards = document.querySelectorAll('div[class*="PaymentMethodCard_paymentMethodCard"]');
  cards.forEach((el, idx) => {
    if (idx === cards.length - 1) return; // последнюю не трогаем
    addCustomTextToCard(el);
  });
}

// первый запуск
updateAllCards();

// наблюдаем за будущими изменениями
const observer = new MutationObserver(() => {
  updateAllCards();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
