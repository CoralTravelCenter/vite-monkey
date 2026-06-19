import './style.css';

await customElements.whenDefined('coral-popup');
await customElements.whenDefined('coral-bubble');

const triggerEl = document.getElementById('promo-trigger');
const popupEl = document.getElementById('promo_page_coral');
document.body.append(popupEl)
document.querySelector('div[class*="HeaderTopBar_iconContainer__"]')?.append(triggerEl);

const DELAY = 2500;
const EXPIRED = 5

if (triggerEl && popupEl) {
  triggerEl.addEventListener('click', () => {
    popupEl.show?.();
    ym(96674199, 'reachGoal', 'pop_up_home_page_promocode_click_to_show')
  });
}

const copy = document.getElementById('promocode-copied');

if (copy) {
  let tooltipTimeout;
  let textTimeout;

  copy.addEventListener('click', (e) => {
    ym(96674199, 'reachGoal', 'pop_up_home_page_promocode_copy')

    Cookies.set('pop_up_home_page_promocode', 'true', {expires: EXPIRED})

    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    const tooltip = target.querySelector('.promo-copy-tooltip');
    const label = target.querySelector('.promo-copy-label');

    if (label) {
      label.textContent = 'Промокод скопирован!';
    }

    clearTimeout(tooltipTimeout);
    clearTimeout(textTimeout);

    if (tooltip) {
      tooltip.classList.add('is-visible');

      tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove('is-visible');
      }, DELAY);
    }

    textTimeout = setTimeout(() => {
      if (label) {
        label.textContent = 'Применить';
      }
    }, DELAY);
  });
}
