# Watchers examples

Короткий справочник по реактивным watcher-утилитам из `utils`.

## Что нужно установить

```bash
npm install rxjs selector-observer
```

## Рекомендуемый импорт

```js
import {
  reactDomObserver,
  createDataLayerWatcher,
  waitSelector,
  insertOnce,
  setLocalStorageWithExpiry,
  getLocalStorageWithExpiry,
} from './utils/index.js';
```

## DOM watcher

### Общая схема

```txt
DOM изменился -> selector-observer нашел элемент -> RxJS stream -> твоя логика
```

### Создать watcher

```js
const domWatcher = reactDomObserver();
```

По умолчанию watcher умеет:

- `observeSelector$(selector, options)` - общий поток событий `initialize | add | remove`
- `added$(selector, options)` - поток только добавленных элементов
- `removed$(selector, options)` - поток только удаленных элементов
- `initialized$(selector, options)` - поток элементов, уже бывших в DOM на момент старта
- `element$(selector, options)` - поток только `element`
- `waitElement$(selector, options)` - поток с первым найденным элементом
- `waitElement(selector, options)` - `Promise` с первым найденным элементом

### Дождаться появления элемента

```js
const domWatcher = reactDomObserver();

const gallery = await domWatcher.waitElement(
  '[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]'
);

console.log('Gallery ready:', gallery);
```

С таймаутом:

```js
const price = await domWatcher.waitElement('[class*="PriceBlock"]', {
  timeoutMs: 15000,
});
```

### Подписаться на добавление элементов

```js
const domWatcher = reactDomObserver();

const subscription = domWatcher
  .added$('[class*="HotelCard"]', {
    name: 'hotel-card',
  })
  .subscribe(({element, name, selector}) => {
    console.log(`[${name}] added`, selector, element);
  });

subscription.unsubscribe();
```

### Подписаться на удаление элементов

```js
const domWatcher = reactDomObserver();

const subscription = domWatcher
  .removed$('[class*="HotelCard"]')
  .subscribe(({element}) => {
    console.log('Hotel card removed:', element);
  });
```

### Обработать уже существующие элементы

```js
const domWatcher = reactDomObserver();

const subscription = domWatcher
  .initialized$('[class*="HotelInfo"]')
  .subscribe(({element}) => {
    console.log('Element was already on page:', element);
  });
```

### Получать только DOM-элементы

```js
const domWatcher = reactDomObserver();

const subscription = domWatcher
  .element$('[class*="PriceBlock"]')
  .subscribe((priceBlock) => {
    console.log('Price block:', priceBlock);
  });
```

### Обработать элемент только один раз

```js
const domWatcher = reactDomObserver();

domWatcher
  .added$('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]')
  .subscribe(({element}) => {
    if (element.dataset.customHandled) return;

    element.dataset.customHandled = 'true';

    // initFeature(element);
  });
```

### Слушать несколько DOM-зон

```js
import {merge} from 'rxjs';

const domWatcher = reactDomObserver();

const subscription = merge(
  domWatcher.added$('[class*="PhotoGalleryMainCarousel"]', {name: 'gallery'}),
  domWatcher.added$('[class*="HotelInfo"]', {name: 'hotel-info'}),
  domWatcher.added$('[class*="PriceBlock"]', {name: 'price'})
).subscribe(({name, element}) => {
  console.log(`[${name}] rendered`, element);
});
```

## dataLayer watcher

### Общая схема

```txt
dataLayer.push(...) -> watcher поймал событие -> RxJS stream -> твоя логика
```

### Создать watcher

```js
const dataLayerWatcher = createDataLayerWatcher();
```

Возвращаемый API:

- `dataLayer` - ссылка на массив `window.dataLayer`
- `dataLayer$` - поток всех событий
- `event$(eventName)` - поток по имени события
- `waitEvent$(eventName)` - поток с первым совпавшим событием
- `waitEvent(eventName, options)` - `Promise` с первым совпавшим событием
- `getLastEvent(eventName)` - последнее событие этого типа
- `subscribe(listener, options)` - подписка на все push/replay
- `destroy()` - снять monkey-patch с `dataLayer.push`

### Дождаться события

```js
const dataLayerWatcher = createDataLayerWatcher();

const viewItem = await dataLayerWatcher.waitEvent('view_item');

console.log('view_item:', viewItem);
```

С таймаутом:

```js
await dataLayerWatcher.waitEvent('begin_checkout', {
  timeoutMs: 20000,
});
```

### Подписаться на событие

```js
const dataLayerWatcher = createDataLayerWatcher();

const subscription = dataLayerWatcher
  .event$('view_item')
  .subscribe((eventData) => {
    console.log('view_item:', eventData);
  });

subscription.unsubscribe();
```

### Слушать все dataLayer-события

```js
const dataLayerWatcher = createDataLayerWatcher();

const unsubscribe = dataLayerWatcher.subscribe((item, source) => {
  console.log(`[dataLayer:${source}]`, item);
});

unsubscribe();
```

Если replay не нужен:

```js
const unsubscribe = dataLayerWatcher.subscribe(
  (item, source) => {
    console.log(source, item);
  },
  {replay: false}
);
```

### Получить последнее событие из истории

```js
const dataLayerWatcher = createDataLayerWatcher();

const lastViewItem = dataLayerWatcher.getLastEvent('view_item');

if (lastViewItem) {
  console.log('Last view_item:', lastViewItem);
}
```

### Реагировать только на новый hotel id

```js
import {distinctUntilChanged, map} from 'rxjs';

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
  .subscribe(({eventData, hotelId}) => {
    console.log('New hotelId:', hotelId);
  });
```

### Отключить watcher

```js
const dataLayerWatcher = createDataLayerWatcher();

dataLayerWatcher.destroy();
```

## DOM + dataLayer together

### Запустить код, когда готов DOM и пришел `view_item`

```js
import {combineLatest} from 'rxjs';

const domWatcher = reactDomObserver();
const dataLayerWatcher = createDataLayerWatcher();

const subscription = combineLatest([
  domWatcher.waitElement$('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]'),
  dataLayerWatcher.waitEvent$('view_item'),
]).subscribe(([gallery, viewItem]) => {
  console.log('DOM ready:', gallery);
  console.log('dataLayer ready:', viewItem);
});
```

### Один раз отработать и завершить

```js
import {combineLatest, take} from 'rxjs';

const domWatcher = reactDomObserver();
const dataLayerWatcher = createDataLayerWatcher();

combineLatest([
  domWatcher.waitElement$('[class*="PhotoGalleryMainCarousel"]'),
  dataLayerWatcher.waitEvent$('view_item'),
])
  .pipe(take(1))
  .subscribe(([gallery, viewItem]) => {
    if (gallery.dataset.customFeatureInitialized) return;

    gallery.dataset.customFeatureInitialized = 'true';

    // initFeature(gallery, viewItem);
  });
```

## Практичные сценарии

### Вставить блок один раз после появления контейнера

```js
const domWatcher = reactDomObserver();

domWatcher
  .added$('[class*="HotelInfo"]')
  .subscribe(({element}) => {
    insertOnce(
      element,
      'beforeend',
      '<div class="custom-info">Подборка для семейного отдыха</div>',
      'family-info-block'
    );
  });
```

### Сохранить событие в localStorage с TTL

```js
const dataLayerWatcher = createDataLayerWatcher();

dataLayerWatcher
  .event$('purchase')
  .subscribe((eventData) => {
    setLocalStorageWithExpiry('last_purchase_event', eventData, 1);
  });
```

### Восстановить последнее сохраненное событие

```js
const cachedPurchase = getLocalStorageWithExpiry('last_purchase_event');

if (cachedPurchase) {
  console.log('Cached purchase:', cachedPurchase);
}
```
