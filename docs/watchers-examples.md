# Utils / Watchers examples

## Установка зависимостей для reactive watchers

```bash
npm install rxjs selector-observer
```

## Рекомендуемый импорт

```js
import {
  createSelectorWatcher,
  createDataLayerWatcher,
  waitSelector,
  insertOnce,
  setLocalStorageWithExpiry,
  getLocalStorageWithExpiry,
} from './utils/index.js';
```

---

# 1. DOM watcher

## Общая схема

```txt
DOM изменился → selector-observer поймал элемент → RxJS stream → твоя логика
```

## Дождаться появления элемента

```js
const selectorWatcher = reactDomObserver();

selectorWatcher
  .waitElement('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]')
  .then((gallery) => {
    console.log('Галерея появилась:', gallery);

    // renderCustomBlock(gallery);
  });
```

## Подписаться на появление элементов

```js
const selectorWatcher = reactDomObserver();

const subscription = selectorWatcher
  .added$('[class*="HotelCard"]', {
    name: 'hotel-card',
  })
  .subscribe(({element, name}) => {
    console.log(`[${name}] added`, element);

    // handleHotelCard(element);
  });

subscription.unsubscribe();
```

## Обработать элемент только один раз

```js
const selectorWatcher = reactDomObserver();

selectorWatcher
  .added$('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]', {
    name: 'gallery',
  })
  .subscribe(({element}) => {
    if (element.dataset.customHandled) return;

    element.dataset.customHandled = 'true';

    // initGalleryFeature(element);
  });
```

## Слушать несколько DOM-зон

```js
import {merge} from 'rxjs';

const selectorWatcher = reactDomObserver();

const subscription = merge(
  selectorWatcher.added$('[class*="PhotoGalleryMainCarousel"]', {name: 'gallery'}),
  selectorWatcher.added$('[class*="HotelInfo"]', {name: 'hotel-info'}),
  selectorWatcher.added$('[class*="PriceBlock"]', {name: 'price'})
).subscribe(({name, element}) => {
  console.log(`[${name}] rendered`, element);
});
```

---

# 2. dataLayer watcher

## Общая схема

```txt
dataLayer.push(...) → watcher поймал событие → RxJS stream → твоя логика
```

## Дождаться события

```js
const dataLayerWatcher = createDataLayerWatcher();

dataLayerWatcher
  .waitEvent('view_item')
  .then((eventData) => {
    console.log('view_item:', eventData);

    // handleViewItem(eventData);
  });
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

## Получить последнее событие

```js
const dataLayerWatcher = createDataLayerWatcher();

const lastViewItem = dataLayerWatcher.getLastEvent('view_item');

if (lastViewItem) {
  // handleViewItem(lastViewItem);
}
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

---

# 3. DOM + dataLayer

## Запустить код, когда готов DOM и dataLayer

```js
import {combineLatest} from 'rxjs';

const selectorWatcher = reactDomObserver();
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
import {combineLatest, take} from 'rxjs';

const selectorWatcher = reactDomObserver();
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

# 4. Storage helpers

## Записать значение с TTL

```js
setLocalStorageWithExpiry('june_26_segment', 'family', 7);
```

## Прочитать значение с TTL

```js
const segment = getLocalStorageWithExpiry('june_26_segment');

if (segment) {
  console.log('segment:', segment);
}
```

## Выполнить код один раз за сессию

```js
if (runOncePerSession('june_26_popup')) {
  // showPopup();
}
```

---

# 5. Wait helpers

## Дождаться DOMContentLoaded

```js
await asap();
```

## Дождаться селектора

```js
const button = await waitSelector('[data-route-switch="family"]');
```

## Дождаться внешней библиотеки

```js
const PopMechanic = await waitForWindowVar('PopMechanic');
```

```js
const Cookies = await waitForLibrary(() => window.Cookies);
```

---

# 6. DOM insert helpers

## Вставить HTML один раз

```js
insertOnce(
  document.body,
  'beforeend',
  '<div class="custom-banner">Hello</div>',
  'custom-banner-v1'
);
```

## Добавить DOM-элемент один раз

```js
const badge = document.createElement('div');
badge.className = 'custom-badge';
badge.textContent = 'Рекомендовано';

appendOnce(document.body, badge, 'custom-badge-v1');
```

## Вставить после элемента

```js
const title = document.querySelector('h1');
const badge = document.createElement('span');
badge.textContent = 'NEW';

insertAfter(badge, title);
```

---

# 7. Intersection helpers

## Запустить callback, когда элемент попал во viewport

```js
const io = watchIntersection(
  '.hotel-card',
  { threshold: 0.5 },
  (element) => {
    console.log('visible:', element);
  },
  (element) => {
    console.log('hidden:', element);
  }
);

io.disconnect();
```

## Дождаться исчезновения элементов

```js
waitUntilElementsGone(
  {
    required: ['.loader'],
    floating: ['.ant-spin'],
  },
  () => {
    console.log('loading finished');
  }
);
```

---

# 8. Analytics helpers

## Отправить цель Яндекс.Метрики по клику

```js
const button = document.querySelector('[data-send-goal]');

setYMTarget(button, 96674199, 'june_26_click');
```

## Отправить событие один раз за TTL

```js
sendYandexEventOnce('june_26_pop_up_show', 2, () => {
  ym(96674199, 'reachGoal', 'june_26_pop_up_show');
});
```

---

# 9. Network helpers

## Собрать endpoint URL

```js
const url = endpointUrl('/endpoints/Customer/SubmitCommercialOfferForm');
```

## Отправить JSON на сервер

```js
const result = await doRequestToServer(
  '/endpoints/Customer/SubmitCommercialOfferForm',
  payload
);
```

## Превратить объект в query string

```js
const query = params2query({ hotelId: 123, segment: 'family' });
```

---

# 10. UI helpers

## Click outside

```js
const clickOutside = new ClickOutside('.modal', () => {
  console.log('click outside modal');
});

clickOutside.destroy();
```

## Media matcher

```js
mediaMatcher(768, (isDesktop) => {
  console.log(isDesktop ? 'desktop' : 'mobile');
});
```

---

# 11. Media helpers

## Подгрузить внешний script

```js
await preloadScript('https://example.com/script.js');
```

## Vimeo autoplay для элементов с data-vimeo-vid

```html
<div data-vimeo-vid="123456789"></div>
```

```js
await vimeoAutoPlay({ threshold: 0.33 });
```

---

# 12. Legacy observers

## SimpleReactDomObserver

```js
const observer = new SimpleReactDomObserver('[class*="HotelCard"]', {
  once: false,
  debug: true,
  onAppear(element) {
    console.log('appeared:', element);
  },
});

observer.start();

// observer.stop();
```

## ReactDomObserver в режиме all

```js
const observer = new ReactDomObserver(
  [
    '[class*="PhotoGalleryMainCarousel"]',
    '[class*="HotelInfo"]',
  ],
  {
    mode: 'all',
    once: true,
    debug: true,
    onAllAppear(elements, selectors) {
      console.log('all ready:', elements, selectors);
    },
  }
);

observer.start();
```
