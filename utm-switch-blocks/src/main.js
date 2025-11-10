import {SimpleReactDomObserver} from "../../utils.js";

const TARGET_UTM_PATTERNS = [
  '_egypt_',
  '_oae_',
  '_thailand_',
  '_vietnam_'
];

const COUNTRY_BY_TOKEN = new Map([
  ['_egypt_', 'Египет'],
  ['_oae_', 'ОАЭ'],
  ['_thailand_', 'Таиланд'],
  ['_vietnam_', 'Вьетнам'],
]);

function getUtmInfo(url) {
  const utmCampaign = new URL(url).searchParams.get('utm_campaign');
  if (!utmCampaign) {
    return {isUtm: false, country: null};
  }

  const isUtm = TARGET_UTM_PATTERNS.some(pattern =>
    utmCampaign.includes(pattern),
  );

  let country = null;
  for (const [token, name] of COUNTRY_BY_TOKEN) {
    if (utmCampaign.includes(token)) {
      country = name;
      break;
    }
  }

  return {isUtm, country};
}

function swapElements(el1, el2) {
  if (!(el1 instanceof Element) || !(el2 instanceof Element)) {
    throw new Error('Оба аргумента должны быть DOM элементами');
  }

  const parent1 = el1.parentNode;
  const parent2 = el2.parentNode;

  if (!parent1 || !parent2) return;

  const sibling1 = el1.nextSibling === el2 ? el1 : el1.nextSibling;

  parent2.insertBefore(el1, el2);
  parent1.insertBefore(el2, sibling1);
}

const {isUtm, country} = getUtmInfo(location.href);
if (isUtm) {
  const el1 = document.querySelector('#hotels-set-turkey');
  const el2 = document.querySelector('#hotels-set');

  if (el1 && el2) {
    swapElements(el1, el2);
  }
  if (country) {
    const selector = `[data-value="${country}"]`;
    new SimpleReactDomObserver(selector, {
      onAppear: (el) => {
        console.log(el)
        el.click()
      }
    }).start();
  }
}
