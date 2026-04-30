# Utils examples

Документ с короткими примерами использования всех утилит из разбитого `utils/`.

## Установка зависимостей для reactive watchers

```bash
npm install rxjs selector-observer
```

## Рекомендуемый импорт

```js
import {
  setLocalStorageWithExpiry,
  getLocalStorageWithExpiry,
  runOncePerSession,

  asap,
  debounce,
  hostReactAppReady,
  waitSelector,
  waiteSelector,
  waitForLibrary,
  waitForWindowVar,

  getMobileOS,
  getBrand,
  mediaMatcher,
  isMobile,

  copyToClipboard,

  queryParam,
  endpointUrl,
  params2query,

  getNextData,
  generateRandomId,
  doRequestToServer,
  filterUniqueMatchingHotels,

  arrayOfNodesWith,
  appendOnce,
  prependOnce,
  insertOnce,
  insertAfter,
  watchIntersection,
  waitUntilElementsGone,
  ClickOutside,
  createSelectorWatcher,

  setYMTarget,
  sendYandexEventOnce,
  createDataLayerWatcher,

  preloadScript,
  vimeoAutoPlay,

  CoralCookieObserver,
} from './utils/index.js';
```

---

# 1. Storage helpers

## `setLocalStorageWithExpiry` / `getLocalStorageWithExpiry`

Сохранить значение в `localStorage` с TTL в днях.

```js
setLocalStorageWithExpiry('june_26_segment', 'family', 7);

const segment = getLocalStorageWithExpiry('june_26_segment');

if (segment) {
  console.log('Сегмент из localStorage:', segment);
}
```

Если срок истёк, `getLocalStorageWithExpiry` удалит ключ и вернёт `null`.

```js
const cachedConfig = getLocalStorageWithExpiry('hotels_config');

if (!cachedConfig) {
  console.log('Кеш пустой или просрочен');
}
```

## `runOncePerSession`

Запустить код один раз за браузерную сессию.

```js
if (runOncePerSession('june_popup_shown')) {
  console.log('Первый запуск в этой сессии');

  // showPopup();
}
```

---

# 2. Lifecycle helpers

## `asap`

Запустить код сразу, если DOM уже готов, или дождаться `DOMContentLoaded`.

```js
asap(() => {
  console.log('DOM готов');

  // initFeature();
});
```

Можно использовать через `await`.

```js
await asap();

console.log('Можно безопасно работать с DOM');
```

## `debounce`

Отложить частые вызовы функции.

```js
const onResize = debounce(() => {
  console.log('resize finished');
}, 300);

window.addEventListener('resize', onResize);
```

Пример для input.

```js
const input = document.querySelector('[data-search]');

input?.addEventListener(
  'input',
  debounce((event) => {
    console.log('Поиск:', event.target.value);
  }, 400)
);
```

## `hostReactAppReady`

Дождаться, когда корневой контейнер React-приложения появится и получит высоту.

```js
const host = await hostReactAppReady('#__next > div');

console.log('React host готов:', host);

// initCustomFeature();
```

## `waitSelector`

Дождаться появления элемента по селектору.

```js
const gallery = await waitSelector(
  '[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]'
);

console.log('Галерея найдена:', gallery);
```

## `waiteSelector`

Alias для старого названия с опечаткой. Лучше использовать `waitSelector`, но старые импорты не сломаются.

```js
const el = await waiteSelector('.legacy-selector');

console.log(el);
```

## `waitForLibrary`

Дождаться появления внешней библиотеки.

```js
const Swiper = await waitForLibrary(() => window.Swiper);

console.log('Swiper готов:', Swiper);
```

## `waitForWindowVar`

Дождаться появления переменной в `window`.

```js
const PopMechanic = await waitForWindowVar('PopMechanic');

console.log('PopMechanic готов:', PopMechanic);
```

---

# 3. Environment helpers

## `getMobileOS`

Определить мобильную ОС.

```js
const os = getMobileOS();

if (os === 'iOS') {
  document.body.classList.add('is-ios');
}

if (os === 'android') {
  document.body.classList.add('is-android');
}
```

## `getBrand`

Определить бренд по hostname.

```js
const brand = getBrand();

if (brand === 'coral') {
  console.log('Coral Travel');
}

if (brand === 'sunmar') {
  console.log('Sunmar');
}
```

## `mediaMatcher`

Подписаться на изменение media query `(min-width: Xpx)`.

```js
mediaMatcher(768, (isDesktop) => {
  document.body.classList.toggle('is-desktop', isDesktop);
  document.body.classList.toggle('is-mobile-layout', !isDesktop);
});
```

## `isMobile`

Быстрая проверка user-agent.

```js
if (isMobile) {
  console.log('Мобильное устройство');
}
```

---

# 4. Clipboard

## `copyToClipboard`

Скопировать текст в буфер обмена.

```js
const button = document.querySelector('[data-copy-promocode]');

button?.addEventListener('click', async () => {
  await copyToClipboard('SUMMER26');

  button.textContent = 'Промокод скопирован';
});
```

---

# 5. URL helpers

## `queryParam`

Получить один query-параметр из текущего URL.

```js
const hotelId = queryParam('hotelId');

console.log('hotelId:', hotelId);
```

Получить все параметры.

```js
const params = queryParam();

console.log(params);
```

Передать свой source URL.

```js
const value = queryParam('segment', 'https://example.com/?segment=family');

console.log(value); // family
```

## `params2query`

Собрать query string из объекта.

```js
const query = params2query({
  hotelId: 123,
  segment: 'family',
  filters: ['sea', 'spa'],
});

console.log(query);
// hotelId=123&segment=family&filters=%5B%22sea%22%2C%22spa%22%5D
```

## `endpointUrl`

Собрать API URL с учетом локального прокси.

```js
const url = endpointUrl('/api/hotels/search');

console.log(url);
```

На `localhost` получится прокси вида:

```txt
http://localhost:8010/proxy/api/hotels/search
```

На боевом hostname домен будет заменён на `b2capi...`.

---

# 6. Next.js helper

## `getNextData`

Получить данные из `#__NEXT_DATA__`.

```js
const nextData = getNextData();

console.log('Next.js data:', nextData);
```

Пример достать props.

```js
const pageProps = getNextData()?.props?.pageProps;

console.log(pageProps);
```

---

# 7. ID helper

## `generateRandomId`

Сгенерировать случайный ID.

```js
const id = generateRandomId();

console.log(id);
```

С указанием длины.

```js
const shortId = generateRandomId(6);

console.log(shortId);
```

---

# 8. Network helper

## `doRequestToServer`

POST-запрос на endpoint через `endpointUrl`.

```js
const result = await doRequestToServer('/endpoints/Customer/SubmitCommercialOfferForm', {
  name: 'Mikhail',
  email: 'test@example.com',
});

console.log(result);
```

С другим методом.

```js
const result = await doRequestToServer(
  '/api/example',
  { id: 123 },
  'PUT'
);
```

---

# 9. Hotels helper

## `filterUniqueMatchingHotels`

Оставить только уникальные отели, имена которых есть в списке запрошенных.

```js
const responses = [
  {
    result: {
      locations: [
        { id: 101, name: 'Hotel One' },
        { id: 102, name: 'Hotel Two' },
      ],
    },
  },
  {
    result: {
      locations: [
        { id: 101, name: 'Hotel One' },
        { id: 103, name: 'Hotel Three' },
      ],
    },
  },
];

const hotels = filterUniqueMatchingHotels(responses, [
  'Hotel One',
  'Hotel Three',
]);

console.log(hotels);
// [{ id: 101, name: 'Hotel One' }, { id: 103, name: 'Hotel Three' }]
```

---

# 10. DOM helpers

## `arrayOfNodesWith`

Привести разные типы входных данных к массиву DOM-нод.

```js
const nodesFromSelector = arrayOfNodesWith('.hotel-card');
const nodesFromNodeList = arrayOfNodesWith(document.querySelectorAll('.hotel-card'));
const nodesFromSingleNode = arrayOfNodesWith(document.body);

console.log(nodesFromSelector, nodesFromNodeList, nodesFromSingleNode);
```

Можно передать массив смешанных значений.

```js
const nodes = arrayOfNodesWith([
  '.hotel-card',
  document.querySelector('.price-block'),
]);

console.log(nodes);
```

## `appendOnce`

Добавить элемент в конец target только один раз по id.

```js
const target = document.querySelector('.hotel-card');
const badge = document.createElement('div');

badge.className = 'custom-badge';
badge.textContent = 'Рекомендуем';

appendOnce(target, badge, 'recommend-badge');
```

## `prependOnce`

Добавить элемент в начало target только один раз по id.

```js
const target = document.querySelector('.hotel-card');
const label = document.createElement('div');

label.className = 'custom-label';
label.textContent = 'Семейный отдых';

prependOnce(target, label, 'family-label');
```

## `insertOnce`

Вставить HTML один раз по id.

```js
const target = document.querySelector('.hotel-card');

insertOnce(
  target,
  'beforeend',
  '<div class="custom-ribbon">Лучший выбор</div>',
  'best-choice-ribbon'
);
```

Позиции такие же, как у `insertAdjacentHTML`:

```txt
beforebegin | afterbegin | beforeend | afterend
```

## `insertAfter`

Вставить DOM-ноду после referenceNode.

```js
const reference = document.querySelector('.hotel-title');
const note = document.createElement('div');

note.className = 'hotel-note';
note.textContent = 'Есть семейные номера';

insertAfter(note, reference);
```

## `watchIntersection`

Следить за попаданием элементов в viewport.

```js
const observer = watchIntersection(
  '.hotel-card',
  { threshold: 0.5 },
  (target) => {
    console.log('Появился в viewport:', target);
    target.classList.add('is-visible');
  },
  (target) => {
    console.log('Ушел из viewport:', target);
    target.classList.remove('is-visible');
  }
);

// Остановить наблюдение
observer.disconnect();
```

## `waitUntilElementsGone`

Дождаться исчезновения обязательных и плавающих элементов.

```js
waitUntilElementsGone(
  {
    required: ['.loader', '.page-skeleton'],
    floating: ['.ant-spin', '.modal-loading'],
  },
  () => {
    console.log('Загрузчики исчезли, можно запускать код');

    // initFeature();
  }
);
```

## `ClickOutside`

Вызвать callback при клике вне элемента.

```js
const clickOutside = new ClickOutside('.custom-dropdown', () => {
  document.querySelector('.custom-dropdown')?.classList.remove('is-open');
});

// Позже снять слушатель
clickOutside.destroy();
```

Игнорировать клики по отдельным элементам.

```js
const clickOutside = new ClickOutside(
  '.custom-dropdown',
  () => {
    console.log('Клик вне dropdown');
  },
  {
    ignore: ['.custom-dropdown-trigger', '.datepicker-popup'],
  }
);
```

Один раз и остановиться.

```js
new ClickOutside(
  '.custom-modal',
  () => {
    document.querySelector('.custom-modal')?.remove();
  },
  { once: true }
);
```

---

# 11. DOM reactive watcher

## Общая схема

```txt
DOM изменился → selector-observer поймал элемент → RxJS stream → твоя логика
```

## `createSelectorWatcher` — дождаться элемента

```js
const selectorWatcher = createSelectorWatcher();

const gallery = await selectorWatcher.waitElement(
  '[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]'
);

console.log('Галерея готова:', gallery);
```

## Подписаться на появление элементов

```js
const selectorWatcher = createSelectorWatcher();

const subscription = selectorWatcher
  .added$('[class*="HotelCard"]', {
    name: 'hotel-card',
  })
  .subscribe(({ element, name }) => {
    console.log(`[${name}] added`, element);

    // handleHotelCard(element);
  });

subscription.unsubscribe();
```

## Подписаться на удаление элементов

```js
const selectorWatcher = createSelectorWatcher();

const subscription = selectorWatcher
  .removed$('[class*="HotelCard"]', {
    name: 'hotel-card',
  })
  .subscribe(({ element }) => {
    console.log('Карточка удалена:', element);
  });
```

## Получить поток только DOM-элементов

```js
const selectorWatcher = createSelectorWatcher();

selectorWatcher
  .element$('[class*="PriceBlock"]')
  .subscribe((priceBlock) => {
    console.log('PriceBlock:', priceBlock);
  });
```

## Обработать элемент только один раз

```js
const selectorWatcher = createSelectorWatcher();

selectorWatcher
  .added$('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]')
  .subscribe(({ element }) => {
    if (element.dataset.customHandled) return;

    element.dataset.customHandled = 'true';

    // renderCustomRibbon(element);
  });
```

## Слушать несколько зон страницы

```js
import { merge } from 'rxjs';

const selectorWatcher = createSelectorWatcher();

const subscription = merge(
  selectorWatcher.added$('[class*="PhotoGalleryMainCarousel"]', { name: 'gallery' }),
  selectorWatcher.added$('[class*="HotelInfo"]', { name: 'hotel-info' }),
  selectorWatcher.added$('[class*="PriceBlock"]', { name: 'price' })
).subscribe(({ name, element }) => {
  console.log(`[${name}] rendered`, element);
});
```

---

# 12. Analytics helpers

## `setYMTarget`

Повесить цель Яндекс.Метрики на клик.

```js
const button = document.querySelector('[data-book-button]');

if (button) {
  setYMTarget(button, 96674199, 'book_button_click');
}
```

## `sendYandexEventOnce`

Отправить событие не чаще одного раза за TTL.

```js
sendYandexEventOnce('june_26_pop_up_show', 2, () => {
  ym(96674199, 'reachGoal', 'june_26_pop_up_show');
});
```

---

# 13. dataLayer reactive watcher

## Общая схема

```txt
dataLayer.push(...) → watcher поймал событие → RxJS stream → твоя логика
```

## `createDataLayerWatcher` — дождаться события

```js
const dataLayerWatcher = createDataLayerWatcher();

const viewItem = await dataLayerWatcher.waitEvent('view_item');

console.log('view_item:', viewItem);
```

## Подписаться на событие

```js
const dataLayerWatcher = createDataLayerWatcher();

const subscription = dataLayerWatcher
  .event$('view_item')
  .subscribe((eventData) => {
    console.log('view_item:', eventData);

    // handleViewItem(eventData);
  });

subscription.unsubscribe();
```

## Получить последнее событие из истории

```js
const dataLayerWatcher = createDataLayerWatcher();

const lastViewItem = dataLayerWatcher.getLastEvent('view_item');

if (lastViewItem) {
  console.log('Последний view_item:', lastViewItem);
}
```

## Слушать все dataLayer-события

```js
const dataLayerWatcher = createDataLayerWatcher();

const unsubscribe = dataLayerWatcher.subscribe((item, source) => {
  console.log(`[dataLayer:${source}]`, item);
});

unsubscribe();
```

## Реагировать только на новый hotel id

```js
import { distinctUntilChanged, map } from 'rxjs';

const dataLayerWatcher = createDataLayerWatcher();

const subscription = dataLayerWatcher
  .event$('view_item')
  .pipe(
    map((eventData) => ({
      eventData,
      hotelId: eventData?.ecommerce?.items?.[0]?.item_id,
    })),
    distinctUntilChanged((prev, next) => prev.hotelId === next.hotelId)
  )
  .subscribe(({ eventData, hotelId }) => {
    console.log('Новый hotelId:', hotelId);

    // handleHotel(eventData, hotelId);
  });
```

## Отключить watcher

```js
const dataLayerWatcher = createDataLayerWatcher();

dataLayerWatcher.destroy();
```

---

# 14. DOM + dataLayer together

## Запустить код, когда готов DOM и пришёл `view_item`

```js
import { combineLatest } from 'rxjs';

const selectorWatcher = createSelectorWatcher();
const dataLayerWatcher = createDataLayerWatcher();

const subscription = combineLatest([
  selectorWatcher.waitElement$('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]'),
  dataLayerWatcher.waitEvent$('view_item'),
]).subscribe(([gallery, viewItem]) => {
  console.log('DOM готов:', gallery);
  console.log('dataLayer готов:', viewItem);

  // renderCustomFeature(gallery, viewItem);
});
```

## Один раз отработать и завершить

```js
import { combineLatest, take } from 'rxjs';

const selectorWatcher = createSelectorWatcher();
const dataLayerWatcher = createDataLayerWatcher();

combineLatest([
  selectorWatcher.waitElement$('[class*="PhotoGalleryMainCarousel"]'),
  dataLayerWatcher.waitEvent$('view_item'),
])
  .pipe(take(1))
  .subscribe(([gallery, viewItem]) => {
    if (gallery.dataset.customFeatureInitialized) return;

    gallery.dataset.customFeatureInitialized = 'true';

    // initFeature(gallery, viewItem);
  });
```

---

# 15. Media helpers

## `preloadScript`

Загрузить внешний скрипт и дождаться `load`.

```js
await preloadScript('https://example.com/widget.js');

console.log('Скрипт загружен');
```

С callback.

```js
await preloadScript('https://example.com/widget.js', () => {
  console.log('callback после загрузки');
});
```

## `vimeoAutoPlay`

Автозапуск Vimeo-видео при попадании блока в viewport.

HTML:

```html
<div data-vimeo-vid="123456789"></div>
```

JS:

```js
vimeoAutoPlay();
```

С настройками `IntersectionObserver`.

```js
vimeoAutoPlay({
  threshold: 0.5,
});
```

---

# 16. Cookies

## `CoralCookieObserver`

Отслеживать изменение cookie по polling-интервалу.

```js
const observer = new CoralCookieObserver('june_26_segment', {
  delay: 500,
});

observer.onChange((currentValue, previousValue) => {
  console.log('Cookie изменилась:', {
    previousValue,
    currentValue,
  });

  // syncSegment(currentValue);
});

observer.start();
```

Остановить наблюдение.

```js
observer.stop();
```

Получить текущее значение вручную.

```js
const value = observer.getCookieValue();

console.log(value);
```

---

# 17. Практичные композиции

## Инициализировать фичу после готовности React host и dataLayer

```js
const selectorWatcher = createSelectorWatcher();
const dataLayerWatcher = createDataLayerWatcher();

await hostReactAppReady();

const [gallery, viewItem] = await Promise.all([
  selectorWatcher.waitElement('[class*="PhotoGalleryMainCarousel"]'),
  dataLayerWatcher.waitEvent('view_item'),
]);

console.log({ gallery, viewItem });

// initFeature(gallery, viewItem);
```

## Вставить блок один раз после появления контейнера

```js
const selectorWatcher = createSelectorWatcher();

selectorWatcher
  .added$('[class*="HotelInfo"]')
  .subscribe(({ element }) => {
    insertOnce(
      element,
      'beforeend',
      '<div class="custom-info">Подборка для семейного отдыха</div>',
      'family-info-block'
    );
  });
```

## Отправить цель один раз после появления блока

```js
const selectorWatcher = createSelectorWatcher();

selectorWatcher
  .waitElement('[data-custom-popup]')
  .then(() => {
    sendYandexEventOnce('custom_popup_show', 2, () => {
      ym(96674199, 'reachGoal', 'custom_popup_show');
    });
  });
```

## Открывать dropdown и закрывать по клику снаружи

```js
const button = document.querySelector('[data-dropdown-button]');
const dropdown = document.querySelector('[data-dropdown]');

button?.addEventListener('click', () => {
  dropdown?.classList.add('is-open');
});

const outside = new ClickOutside('[data-dropdown]', () => {
  dropdown?.classList.remove('is-open');
}, {
  ignore: ['[data-dropdown-button]'],
});
```

## Сохранить сегмент и синхронизировать UI

```js
const segment = queryParam('segment') || 'family';

setLocalStorageWithExpiry('june_26_segment', segment, 14);

document.body.dataset.segment = segment;
```

## Достать hotelId из dataLayer и вставить бейдж в DOM

```js
const selectorWatcher = createSelectorWatcher();
const dataLayerWatcher = createDataLayerWatcher();

const [card, viewItem] = await Promise.all([
  selectorWatcher.waitElement('[class*="HotelCard"]'),
  dataLayerWatcher.waitEvent('view_item'),
]);

const hotelId = viewItem?.ecommerce?.items?.[0]?.item_id;

if (hotelId) {
  insertOnce(
    card,
    'beforeend',
    `<div class="hotel-id-badge">ID отеля: ${hotelId}</div>`,
    `hotel-id-${hotelId}`
  );
}
```
