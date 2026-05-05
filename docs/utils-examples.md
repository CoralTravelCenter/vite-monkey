# Utils examples

Практический справочник по утилитам из `utils/` и точке входа `utils/index.js`.

## Быстрый импорт

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
  reactDomObserver,
  setYMTarget,
  sendYandexEventOnce,
  createDataLayerWatcher,
  preloadScript,
  vimeoAutoPlay,
  CoralCookieObserver,
} from './utils/index.js';
```

## Storage

### `setLocalStorageWithExpiry(key, value, expiryInDays)`

Сохраняет значение в `localStorage` с TTL в днях.

```js
setLocalStorageWithExpiry('june_26_segment', 'family', 7);
```

### `getLocalStorageWithExpiry(key)`

Читает значение. Если срок истек или JSON поврежден, удаляет ключ и возвращает `null`.

```js
const segment = getLocalStorageWithExpiry('june_26_segment');

if (segment) {
  console.log('Segment:', segment);
}
```

### `runOncePerSession(key = 'codeExecuted')`

Возвращает `true` только при первом вызове в рамках текущей browser session.

```js
if (runOncePerSession('june_popup_shown')) {
  // showPopup();
}
```

## Lifecycle

### `asap(cb?)`

Вызывает callback сразу, если DOM уже готов, или дожидается `DOMContentLoaded`.

```js
await asap();

console.log('DOM is ready');
```

```js
asap(() => {
  // initFeature();
});
```

### `debounce(callee, timeoutMs = 0)`

Создает debounced-обертку.

```js
const onResize = debounce(() => {
  console.log('resize finished');
}, 300);

window.addEventListener('resize', onResize);
```

### `hostReactAppReady(selector = '#__next > div', timeout = 300)`

Ждет, пока корневой React-контейнер появится и получит ненулевую высоту.

```js
const host = await hostReactAppReady('#__next > div');

console.log('React host ready:', host);
```

### `waitSelector(selector, timeout = 200)`

Ожидает появления DOM-элемента.

```js
const gallery = await waitSelector('[class*="PhotoGalleryMainCarousel"]');
```

### `waiteSelector(selector, timeout = 200)`

Старый alias с опечаткой для обратной совместимости.

```js
const legacyElement = await waiteSelector('.legacy-selector');
```

### `waitForLibrary(getterFn, timeout = 200)`

Периодически вызывает `getterFn`, пока тот не вернет truthy-значение.

```js
const Swiper = await waitForLibrary(() => window.Swiper);
```

### `waitForWindowVar(name, intervalMs = 300)`

Ждет переменную в `window`.

```js
const PopMechanic = await waitForWindowVar('PopMechanic');
```

## Environment

### `getMobileOS()`

Возвращает `'android'`, `'iOS'` или `'other'`.

```js
const os = getMobileOS();
```

### `getBrand()`

Определяет бренд по `location.host`. Сейчас возвращает `sunmar`, `coral` или `null`.

```js
const brand = getBrand();
```

### `mediaMatcher(size, callback)`

Подписывает на media query `(min-width: ${size}px)`.

```js
mediaMatcher(768, (isDesktop) => {
  document.body.classList.toggle('is-desktop', isDesktop);
});
```

### `isMobile`

Быстрый флаг по user-agent.

```js
if (isMobile) {
  console.log('Mobile device');
}
```

## Clipboard

### `copyToClipboard(text)`

Копирует строку через `navigator.clipboard.writeText`.

```js
await copyToClipboard('SUMMER26');
```

## URL

### `queryParam(paramName?, source?)`

Читает один query-параметр или весь набор параметров. Если значение похоже на JSON, пытается распарсить.

```js
const hotelId = queryParam('hotelId');
const allParams = queryParam();
const segment = queryParam('segment', 'https://example.com/?segment=family');
```

### `endpointUrl(endpoint)`

Собирает API URL. На `localhost` использует прокси `http://localhost:8010/proxy`.

```js
const url = endpointUrl('/api/hotels/search');
```

### `params2query(paramsObject)`

Собирает query string из объекта. Объекты и массивы сериализуются в JSON.

```js
const query = params2query({
  hotelId: 123,
  filters: ['sea', 'spa'],
});
```

## Next.js

### `getNextData()`

Достает данные из `#__NEXT_DATA__` или `window.__NEXT_DATA__`.

```js
const nextData = getNextData();
const pageProps = nextData?.props?.pageProps;
```

## ID

### `generateRandomId(length = 12)`

Генерирует строковый id из латиницы и цифр.

```js
const id = generateRandomId();
const shortId = generateRandomId(6);
```

## Network

### `doRequestToServer(endpoint, data, method = 'POST')`

Делает JSON-запрос через `fetch` и `endpointUrl`. При ошибке логирует и бросает exception.

```js
const result = await doRequestToServer(
  '/endpoints/Customer/SubmitCommercialOfferForm',
  {
    name: 'Mikhail',
    email: 'test@example.com',
  }
);
```

## Hotels

### `filterUniqueMatchingHotels(responses, requestedNames)`

Фильтрует `response.result.locations`, оставляет только нужные имена и убирает дубли по `location.id`.

```js
const hotels = filterUniqueMatchingHotels(responses, [
  'Hotel One',
  'Hotel Three',
]);
```

## DOM

### `arrayOfNodesWith(what)`

Нормализует вход в массив DOM-узлов. Поддерживает:

- CSS selector
- `Node`
- `NodeList`
- `HTMLCollection`
- массив смешанных значений
- jQuery-объект

```js
const nodes = arrayOfNodesWith([
  '.hotel-card',
  document.querySelector('.price-block'),
]);
```

### `appendOnce(target, element, id = generateRandomId())`

Добавляет DOM-узел в конец `target`, если такой `id` еще не был использован.

```js
appendOnce(target, badge, 'recommend-badge');
```

### `prependOnce(target, element, id = 'default')`

Добавляет DOM-узел в начало `target` один раз.

```js
prependOnce(target, label, 'family-label');
```

### `insertOnce(target, position, html, id)`

Вставляет HTML через `insertAdjacentHTML`, но только один раз на указанный `id`.

```js
insertOnce(
  target,
  'beforeend',
  '<div class="custom-ribbon">Лучший выбор</div>',
  'best-choice-ribbon'
);
```

### `insertAfter(newNode, referenceNode)`

Вставляет DOM-элемент после `referenceNode`.

```js
insertAfter(note, reference);
```

### `watchIntersection(targets, options, yesHandler, noHandler)`

Обертка над `IntersectionObserver`. Поддерживает selector, node, array и другие варианты, совместимые с `arrayOfNodesWith`.

```js
const observer = watchIntersection(
  '.hotel-card',
  {threshold: 0.5},
  (target) => target.classList.add('is-visible'),
  (target) => target.classList.remove('is-visible')
);

observer.disconnect();
```

### `waitUntilElementsGone(config, callback)`

Ждет, пока исчезнут все обязательные и плавающие элементы.

```js
waitUntilElementsGone(
  {
    required: ['.loader', '.page-skeleton'],
    floating: ['.ant-spin', '.modal-loading'],
  },
  () => {
    // initFeature();
  }
);
```

### `ClickOutside`

Класс для закрытия dropdown/modal по клику вне контейнера.

```js
const clickOutside = new ClickOutside(
  '.custom-dropdown',
  () => {
    document.querySelector('.custom-dropdown')?.classList.remove('is-open');
  },
  {
    ignore: ['.custom-dropdown-trigger'],
    once: false,
  }
);

clickOutside.destroy();
```

### `reactDomObserver(defaultOptions?)`

Reactive watcher для DOM. Подробные примеры: [docs/watchers-examples.md](/Users/mike/Documents/GitHub/vite-monkey/docs/watchers-examples.md).

```js
const domWatcher = reactDomObserver();
const gallery = await domWatcher.waitElement('[class*="PhotoGalleryMainCarousel"]');
```

## Analytics

### `setYMTarget(element, targetId, target)`

Вешает отправку цели Яндекс.Метрики на клик.

```js
const button = document.querySelector('[data-book-button]');

if (button) {
  setYMTarget(button, 96674199, 'book_button_click');
}
```

### `sendYandexEventOnce(eventName, ttlHours = 2, cb)`

Вызывает callback не чаще одного раза за TTL.

```js
sendYandexEventOnce('custom_popup_show', 2, () => {
  ym(96674199, 'reachGoal', 'custom_popup_show');
});
```

### `createDataLayerWatcher(options?)`

Reactive watcher для `dataLayer`. Подробные примеры: [docs/watchers-examples.md](/Users/mike/Documents/GitHub/vite-monkey/docs/watchers-examples.md).

```js
const dataLayerWatcher = createDataLayerWatcher();
const viewItem = await dataLayerWatcher.waitEvent('view_item');
```

## Media

### `preloadScript(url, cb?)`

Подгружает внешний скрипт и резолвит promise после `load`.

```js
await preloadScript('https://example.com/widget.js');
```

### `vimeoAutoPlay(observerOptions = {})`

Находит элементы с `data-vimeo-vid`, подгружает Vimeo API и запускает/ставит на паузу видео по `IntersectionObserver`.

HTML:

```html
<div data-vimeo-vid="123456789"></div>
```

JS:

```js
vimeoAutoPlay({
  threshold: 0.5,
});
```

## Cookies

### `CoralCookieObserver`

Polling-наблюдатель за изменениями cookie.

```js
const observer = new CoralCookieObserver('june_26_segment', {
  delay: 500,
});

observer.onChange((currentValue, previousValue) => {
  console.log({previousValue, currentValue});
});

observer.start();
```

Остановить:

```js
observer.stop();
```

Получить текущее значение:

```js
const value = observer.getCookieValue();
```
