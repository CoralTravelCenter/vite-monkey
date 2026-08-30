# Utils: публичный API

Общие утилиты импортируются через корневой alias:

```js
import { waitForElement, reactDomObserver } from "@utils";
```

Корневой `utils/index.js` является стабильной публичной точкой входа. Внутренние файлы разделены по ролям.

## Storage

- `setLocalStorageWithExpiry(key, value, expiryInDays)` — записывает значение с TTL;
- `getLocalStorageWithExpiry(key)` — читает значение и удаляет просроченное;
- `runOncePerSession(key)` — разрешает однократный запуск в browser session.

## Lifecycle

- `asap(callback?)` — ожидает готовность DOM;
- `debounce(callback, timeoutMs)` — откладывает частые вызовы;
- `waitForCondition(check, options)` — опрашивает условие с timeout и AbortSignal;
- `hostReactAppReady(selector, intervalMs)` — ожидает видимый корневой React-контейнер.

## Browser

- `getMobileOS()` — определяет Android, iOS или другое окружение;
- `getBrand()` — определяет Coral или Sunmar по host;
- `mediaMatcher(size, callback, mode)` — следит за media query;
- `copyToClipboard(text)` — записывает текст в clipboard.

## Network

- `queryParam(name?, source?)` — читает query-параметры;
- `params2query(params)` — сериализует объект в query string;
- `endpointUrl(endpoint)` — формирует адрес B2C API;
- `requestJson(url, options?)` — выполняет JSON-запрос;
- `doRequestToServer(endpoint, data, method?)` — отправляет JSON в B2C API.

## DOM

- `arrayOfNodesWith(value)` — нормализует селектор, Node, коллекцию или массив;
- `appendOnce`, `prependOnce`, `insertOnce`, `insertAfter` — вставляют DOM;
- `ClickOutside` — отслеживает клик вне элемента;
- `waitForElement`, `waitForMutation`, `waitForIntersection` — одноразовые Promise-ожидания;
- `watchIntersection` — потоковое наблюдение пересечений;
- `waitUntilElementsGone` — ожидает исчезновение набора элементов;
- `reactDomObserver` — создаёт selector-observer на RxJS;
- `spyMainCarousel`, `watchMainCarouselSlides` — специализированные watcher-функции карусели.

Подробности реактивного слоя находятся в [watchers.md](./watchers.md).

## Analytics

- `setYMTarget(element, targetId, target)` — отправляет цель по клику;
- `sendYandexEventOnce(eventName, ttlHours, callback)` — ограничивает повторную отправку;
- `createDataLayerWatcher(options?)` — создаёт RxJS watcher для `dataLayer`.

## Platform и media

- `getNextData()` — читает `__NEXT_DATA__`;
- `loadScript(url, options?)` — загружает внешний script с дедупликацией запросов;
- `CoralCookieObserver` — следит за изменением cookie;
- `generateRandomId(length?)` — создаёт случайный идентификатор.

## Правило размещения

Функция относится к корневому `utils`, только если она действительно используется несколькими экспериментами. Доменная логика одного проекта хранится внутри его `src/lib` или `src/modules`.
