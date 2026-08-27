# Документация Vite Monkey

Единое руководство по структуре репозитория, созданию и сборке экспериментов, общим утилитам и правилам разработки.

## Оглавление

- [Быстрый старт](#быстрый-старт)
- [Структура репозитория](#структура-репозитория)
- [Создание эксперимента](#создание-эксперимента)
- [Utils: API и примеры](#utils-api-и-примеры)
- [Watchers: API и примеры](#watchers-api-и-примеры)
- [Гигиена репозитория](#гигиена-репозитория)
- [Каталог проектов](#каталог-проектов)

## Быстрый старт

```bash
npm install
npm run dev:experiment -- brands/coral/experiment-name
npm run build:experiment -- brands/coral/experiment-name
```

Перед публикацией:

```bash
npm test
npm run lint
npm run typecheck
npm run format:check
npm run validate:configs
npm run check:deprecated-utils
```

## Структура репозитория

- `brands/coral/*` — эксперименты Coral.
- `brands/sunmar/*` — эксперименты Sunmar.
- `special/*` — небрандовые и служебные проекты.
- `templates/*` — шаблоны новых экспериментов.
- `utils/*` — общий API.
- `scripts/*` — создание, запуск, сборка и проверки.
- `docs/projects-catalog.md` — автоматически формируемый каталог.

Во всех экспериментах доступен alias:

```js
import { waitForElement } from "@utils";
import { waitForMutation } from "@utils/dom/mutation.js";
```

## Создание эксперимента

Новый эксперимент создается из корня репозитория:

```bash
npm run create:experiment -- experiment-name --brand coral
```

Папка создается не в корне, а в брендовой зоне:

- `brands/coral/experiment-name`
- `brands/sunmar/experiment-name`
- `special/experiment-name` для `both` и `custom`

### Базовые варианты

```bash
npm run create:experiment -- experiment-name --brand coral
npm run create:experiment -- experiment-name --brand sunmar
npm run create:experiment -- experiment-name --brand both
```

### Entry file

По умолчанию создается `src/main.js`.

```bash
npm run create:experiment -- experiment-name --brand coral --entry home
```

Допустимые значения:

- `main`
- `home`

### CSS или SCSS

По умолчанию создается `src/style.css`.

```bash
npm run create:experiment -- experiment-name --brand coral --style scss
```

При `--style scss` локальные зависимости не добавляются. `sass` уже установлен в корне репозитория.

### Запуск и сборка

Новые эксперименты можно запускать из корня репозитория:

```bash
npm run dev:experiment -- experiment-name
npm run build:experiment -- experiment-name
```

В папке нового эксперимента больше нет локальных `package.json`, `vite.config.js` и `node_modules`. Инфраструктура сборки общая и живет в корне, а запуск идет через `scripts/run-experiment.js`.

### Зачем это нужно

Так новые эксперименты стартуют одинаково: единая структура, один общий `vite`, один общий `vite-plugin-monkey`, понятные команды запуска и меньше ручного копирования из старых папок.

## Utils: API и примеры

Практический справочник по утилитам из `utils/` и точке входа `utils/index.js`.

### Быстрый импорт

```js
import {
  setLocalStorageWithExpiry,
  getLocalStorageWithExpiry,
  runOncePerSession,
  asap,
  debounce,
  hostReactAppReady,
  waitForCondition,
  getMobileOS,
  getBrand,
  mediaMatcher,
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
  waitForElement,
  waitForMutation,
  waitForIntersection,
  spyMainCarousel,
  watchMainCarouselSlides,
  setYMTarget,
  sendYandexEventOnce,
  createDataLayerWatcher,
  loadScript,
  CoralCookieObserver,
} from "./utils/index.js";
```

Внутри экспериментов можно импортировать то же самое короче через alias:

```js
import {
  waitForElement,
  reactDomObserver,
  createDataLayerWatcher,
} from "@utils";
```

```js
import { spyMainCarousel } from "@utils";
```

```js
import { watchMainCarouselSlides } from "@utils";
```

### Storage

#### `setLocalStorageWithExpiry(key, value, expiryInDays)`

Сохраняет значение в `localStorage` с TTL в днях.

```js
setLocalStorageWithExpiry("june_26_segment", "family", 7);
```

#### `getLocalStorageWithExpiry(key)`

Читает значение. Если срок истек или JSON поврежден, удаляет ключ и возвращает `null`.

```js
const segment = getLocalStorageWithExpiry("june_26_segment");

if (segment) {
  console.log("Segment:", segment);
}
```

#### `runOncePerSession(key = 'codeExecuted')`

Возвращает `true` только при первом вызове в рамках текущей browser session.

```js
if (runOncePerSession("june_popup_shown")) {
  // showPopup();
}
```

### Lifecycle

#### `asap(cb?)`

Вызывает callback сразу, если DOM уже готов, или дожидается `DOMContentLoaded`.

```js
await asap();

console.log("DOM is ready");
```

```js
asap(() => {
  // initFeature();
});
```

#### `debounce(callee, timeoutMs = 0)`

Создает debounced-обертку.

```js
const onResize = debounce(() => {
  console.log("resize finished");
}, 300);

window.addEventListener("resize", onResize);
```

#### `hostReactAppReady(selector = '#__next > div', timeout = 300)`

Ждет, пока корневой React-контейнер появится и получит ненулевую высоту.

```js
const host = await hostReactAppReady("#__next > div");

console.log("React host ready:", host);
```

#### `waitForCondition(check, options)`

Универсальное Promise-ожидание значения с интервалом, таймаутом и `AbortSignal`.

```js
const api = await waitForCondition(() => window.partnerApi, {
  intervalMs: 200,
  timeoutMs: 10000,
});
```

### Environment

#### `getMobileOS()`

Возвращает `'android'`, `'iOS'` или `'other'`.

```js
const os = getMobileOS();
```

#### `getBrand()`

Определяет бренд по `location.host`. Сейчас возвращает `sunmar`, `coral` или `null`.

```js
const brand = getBrand();
```

#### `mediaMatcher(size, callback, mode = "min")`

Подписывает на media query `(min-width: ${size}px)`.

```js
mediaMatcher(768, (isDesktop) => {
  document.body.classList.toggle("is-desktop", isDesktop);
});

mediaMatcher(
  768,
  (isMobile) => {
    document.body.classList.toggle("is-mobile", isMobile);
  },
  "max",
);
```

### Clipboard

#### `copyToClipboard(text)`

Копирует строку через `navigator.clipboard.writeText`.

```js
await copyToClipboard("SUMMER26");
```

### URL

#### `queryParam(paramName?, source?)`

Читает один query-параметр или весь набор параметров. Если значение похоже на JSON, пытается распарсить.

```js
const hotelId = queryParam("hotelId");
const allParams = queryParam();
const segment = queryParam("segment", "https://example.com/?segment=family");
```

#### `endpointUrl(endpoint)`

Собирает API URL. На `localhost` использует прокси `http://localhost:8010/proxy`.

```js
const url = endpointUrl("/api/hotels/search");
```

#### `params2query(paramsObject)`

Собирает query string из объекта. Объекты и массивы сериализуются в JSON.

```js
const query = params2query({
  hotelId: 123,
  filters: ["sea", "spa"],
});
```

### DOM helpers

#### `spyMainCarousel(options)`

Утилита для наблюдения за баннерами в главной карусели: находит элементы внутри карусели, отдает наружу контекст баннера и один раз навешивает `click`-обработчик.

```js
import { spyMainCarousel } from "@utils";

const carouselSpy = spyMainCarousel({
  carouselSelector: '[class*="MainCarousel"]',
  itemSelector: 'a[href*="banner_on_site="]',
  onItem: ({ href, index, item }) => {
    console.log("Banner found:", index, href, item);
  },
  onClick: ({ href, index }) => {
    ym(96674199, "reachGoal", "main_carousel_click", {
      href,
      index,
    });
  },
});

// carouselSpy.unsubscribe();
```

В callback приходит объект с полями `type`, `root`, `slide`, `item`, `href`, `index`.

#### `watchMainCarouselSlides(options)`

Lifecycle-helper для главной карусели. Ждет появления `BannerLinkWrapper...` как сигнала рендера карусели, потом следит за каждым `.glide__slide.swiper-slide`: если контент есть, вызывает `mount`, если контент зачищен или слайд удален, вызывает `unmount`.

```js
import { watchMainCarouselSlides } from "@utils";

const carouselLifecycle = watchMainCarouselSlides({
  carouselSelector: '[class*="MainCarousel"]',
  mount: ({ slide, index }) => {
    const link = slide.querySelector(
      '[class*="BannerLinkWrapper_bannerLinkWrapper"]',
    );

    if (!link) {
      return null;
    }

    const onClick = () => {
      ym(96674199, "reachGoal", "main_carousel_click", { index });
    };

    link.addEventListener("click", onClick);

    return () => {
      link.removeEventListener("click", onClick);
    };
  },
});

// carouselLifecycle.unsubscribe();
```

Если нужно, `mount` может вернуть либо функцию `unmount`, либо объект `{unmount()}`.

### Next.js

#### `getNextData()`

Достает данные из `#__NEXT_DATA__` или `window.__NEXT_DATA__`.

```js
const nextData = getNextData();
const pageProps = nextData?.props?.pageProps;
```

### ID

#### `generateRandomId(length = 12)`

Генерирует строковый id из латиницы и цифр.

```js
const id = generateRandomId();
const shortId = generateRandomId(6);
```

### Network

#### `doRequestToServer(endpoint, data, method = 'POST')`

Делает JSON-запрос через `fetch` и `endpointUrl`. При ошибке логирует и бросает exception.

```js
const result = await doRequestToServer(
  "/endpoints/Customer/SubmitCommercialOfferForm",
  {
    name: "Mikhail",
    email: "test@example.com",
  },
);
```

### Hotels

#### `filterUniqueMatchingHotels(responses, requestedNames)`

Фильтрует `response.result.locations`, оставляет только нужные имена и убирает дубли по `location.id`.

```js
const hotels = filterUniqueMatchingHotels(responses, [
  "Hotel One",
  "Hotel Three",
]);
```

### DOM

#### `arrayOfNodesWith(what)`

Нормализует вход в массив DOM-узлов. Поддерживает:

- CSS selector
- `Node`
- `NodeList`
- `HTMLCollection`
- массив смешанных значений
- jQuery-объект

```js
const nodes = arrayOfNodesWith([
  ".hotel-card",
  document.querySelector(".price-block"),
]);
```

#### `appendOnce(target, element, id = generateRandomId())`

Добавляет DOM-узел в конец `target`, если такой `id` еще не был использован.

```js
appendOnce(target, badge, "recommend-badge");
```

#### `prependOnce(target, element, id = 'default')`

Добавляет DOM-узел в начало `target` один раз.

```js
prependOnce(target, label, "family-label");
```

#### `insertOnce(target, position, html, id)`

Вставляет HTML через `insertAdjacentHTML`, но только один раз на указанный `id`.

```js
insertOnce(
  target,
  "beforeend",
  '<div class="custom-ribbon">Лучший выбор</div>',
  "best-choice-ribbon",
);
```

#### `insertAfter(newNode, referenceNode)`

Вставляет DOM-элемент после `referenceNode`.

```js
insertAfter(note, reference);
```

#### `watchIntersection(targets, options, yesHandler, noHandler)`

Обертка над `IntersectionObserver`. Поддерживает selector, node, array и другие варианты, совместимые с `arrayOfNodesWith`.

```js
const observer = watchIntersection(
  ".hotel-card",
  { threshold: 0.5 },
  (target) => target.classList.add("is-visible"),
  (target) => target.classList.remove("is-visible"),
);

observer.disconnect();
```

#### `waitUntilElementsGone(config, callback)`

Ждет, пока исчезнут все обязательные и плавающие элементы.

```js
waitUntilElementsGone(
  {
    required: [".loader", ".page-skeleton"],
    floating: [".ant-spin", ".modal-loading"],
  },
  () => {
    // initFeature();
  },
);
```

#### `ClickOutside`

Класс для закрытия dropdown/modal по клику вне контейнера.

```js
const clickOutside = new ClickOutside(
  ".custom-dropdown",
  () => {
    document.querySelector(".custom-dropdown")?.classList.remove("is-open");
  },
  {
    ignore: [".custom-dropdown-trigger"],
    once: false,
  },
);

clickOutside.destroy();
```

#### `reactDomObserver(defaultOptions?)`

Reactive watcher для DOM. Подробные примеры: [разделу Watchers](#watchers-api-и-примеры).

```js
import { filter, firstValueFrom, map, timeout } from "rxjs";

const domWatcher = reactDomObserver();
const gallery = await firstValueFrom(
  domWatcher.observeSelector$('[class*="PhotoGalleryMainCarousel"]').pipe(
    filter(({ type }) => type !== "remove"),
    map(({ element }) => element),
    timeout({ first: 10000 }),
  ),
);
```

#### `waitForElement(selector, options?)`

Минимальный helper на чистом `MutationObserver`: просто дождаться DOM-элемента по селектору.

```js
const banner = await waitForElement("#custom-banner");

console.log("Banner ready:", banner);
```

С таймаутом:

```js
const popup = await waitForElement(".custom-popup", {
  timeoutMs: 15000,
});
```

С кастомным root:

```js
const modalBody = document.querySelector(".modal-body");
const field = await waitForElement('[name="email"]', {
  root: modalBody,
  timeoutMs: 5000,
});
```

#### `waitForMutation(target, options?)`

Одноразовое ожидание мутации без RxJS. Поддерживает `predicate`, timeout и `AbortSignal`.

```js
await waitForMutation(document.body, {
  predicate: () => Boolean(document.querySelector(".results-ready")),
});
```

#### `waitForIntersection(target, options?)`

Одноразовое ожидание попадания элемента во viewport.

```js
await waitForIntersection(document.querySelector(".promo"), {
  observerOptions: { threshold: 0.5 },
});
```

### Analytics

#### `setYMTarget(element, targetId, target)`

Вешает отправку цели Яндекс.Метрики на клик.

```js
const button = document.querySelector("[data-book-button]");

if (button) {
  setYMTarget(button, 96674199, "book_button_click");
}
```

#### `sendYandexEventOnce(eventName, ttlHours = 2, cb)`

Вызывает callback не чаще одного раза за TTL.

```js
sendYandexEventOnce("custom_popup_show", 2, () => {
  ym(96674199, "reachGoal", "custom_popup_show");
});
```

#### `createDataLayerWatcher(options?)`

Reactive watcher для `dataLayer`. Подробные примеры: [разделу Watchers](#watchers-api-и-примеры).

```js
import { firstValueFrom } from "rxjs";

const dataLayerWatcher = createDataLayerWatcher();
const viewItem = await firstValueFrom(dataLayerWatcher.event$("view_item"));
```

### Media

#### `loadScript(url, options?)`

Подгружает внешний скрипт и резолвит promise после `load`.

```js
await loadScript("https://example.com/widget.js");
```

### Cookies

#### `CoralCookieObserver`

Polling-наблюдатель за изменениями cookie.

```js
const observer = new CoralCookieObserver("june_26_segment", {
  delay: 500,
});

observer.onChange((currentValue, previousValue) => {
  console.log({ previousValue, currentValue });
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

## Watchers: API и примеры

Короткий справочник по реактивным watcher-утилитам из `utils`.

### Что нужно установить

```bash
npm install rxjs selector-observer
```

### Рекомендуемый импорт

```js
import {
  reactDomObserver,
  waitForElement,
  waitForMutation,
  waitForIntersection,
  createDataLayerWatcher,
  insertOnce,
  setLocalStorageWithExpiry,
  getLocalStorageWithExpiry,
} from "./utils/index.js";
```

### DOM watcher

#### Общая схема

```txt
DOM изменился -> selector-observer нашел элемент -> RxJS stream -> твоя логика
```

Для простого случая без RxJS и `selector-observer` используются Promise-обёртки `waitForElement()`, `waitForMutation()` и `waitForIntersection()`.

#### Создать watcher

```js
const domWatcher = reactDomObserver();
```

Watcher предоставляет один метод: `observeSelector$(selector, options)` — поток событий `initialize | add | remove`. Фильтрация, преобразование, ожидание и таймаут выполняются стандартными операторами RxJS.

#### Дождаться появления элемента

```js
import { filter, firstValueFrom, map } from "rxjs";

const domWatcher = reactDomObserver();

const gallery = await firstValueFrom(
  domWatcher
    .observeSelector$('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]')
    .pipe(
      filter(({ type }) => type !== "remove"),
      map(({ element }) => element),
    ),
);

console.log("Gallery ready:", gallery);
```

С таймаутом:

```js
import { firstValueFrom, timeout } from "rxjs";

const price = await firstValueFrom(
  domWatcher
    .observeSelector$('[class*="PriceBlock"]')
    .pipe(timeout({ first: 15000 })),
);
```

#### Подписаться на добавление элементов

```js
const domWatcher = reactDomObserver();

const subscription = domWatcher
  .observeSelector$('[class*="HotelCard"]', {
    name: "hotel-card",
  })
  .pipe(filter(({ type }) => type === "add"))
  .subscribe(({ element, name, selector }) => {
    console.log(`[${name}] added`, selector, element);
  });

subscription.unsubscribe();
```

#### Подписаться на удаление элементов

```js
const domWatcher = reactDomObserver();

const subscription = domWatcher
  .removed$('[class*="HotelCard"]')
  .subscribe(({ element }) => {
    console.log("Hotel card removed:", element);
  });
```

#### Обработать уже существующие элементы

```js
const domWatcher = reactDomObserver();

const subscription = domWatcher
  .initialized$('[class*="HotelInfo"]')
  .subscribe(({ element }) => {
    console.log("Element was already on page:", element);
  });
```

#### Получать только DOM-элементы

```js
const domWatcher = reactDomObserver();

const subscription = domWatcher
  .element$('[class*="PriceBlock"]')
  .subscribe((priceBlock) => {
    console.log("Price block:", priceBlock);
  });
```

#### Обработать элемент только один раз

```js
const domWatcher = reactDomObserver();

domWatcher
  .added$('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]')
  .subscribe(({ element }) => {
    if (element.dataset.customHandled) return;

    element.dataset.customHandled = "true";

    // initFeature(element);
  });
```

#### Слушать несколько DOM-зон

```js
import { merge } from "rxjs";

const domWatcher = reactDomObserver();

const subscription = merge(
  domWatcher.added$('[class*="PhotoGalleryMainCarousel"]', { name: "gallery" }),
  domWatcher.added$('[class*="HotelInfo"]', { name: "hotel-info" }),
  domWatcher.added$('[class*="PriceBlock"]', { name: "price" }),
).subscribe(({ name, element }) => {
  console.log(`[${name}] rendered`, element);
});
```

### Lightweight DOM helper

#### Когда брать `waitForElement`

- когда нужен только `await` на селектор
- когда не нужен watcher API
- когда хочется решение только на `MutationObserver`, без дополнительных библиотек

#### Базовое использование

```js
const popup = await waitForElement(".custom-popup");

console.log("Popup appeared:", popup);
```

#### С таймаутом

```js
const price = await waitForElement(".price-block", {
  timeoutMs: 15000,
});
```

#### С кастомным root

```js
const modalBody = document.querySelector(".modal-body");

const field = await waitForElement('[name="email"]', {
  root: modalBody,
  timeoutMs: 5000,
});
```

#### Дождаться произвольной мутации

```js
await waitForMutation(document.body, {
  predicate: () => document.querySelector(".results-ready"),
  timeoutMs: 10000,
});
```

#### Дождаться появления элемента во viewport

```js
const entry = await waitForIntersection(document.querySelector(".promo"), {
  observerOptions: { threshold: 0.5 },
});
```

### dataLayer watcher

#### Общая схема

```txt
dataLayer.push(...) -> watcher поймал событие -> RxJS stream -> твоя логика
```

#### Создать watcher

```js
const dataLayerWatcher = createDataLayerWatcher();
```

Возвращаемый API:

- `dataLayer$` - поток всех событий вместе с источником `replay` или `push`
- `event$(eventName)` - поток события с replay истории
- `freshEvent$(eventName)` - поток только новых событий из `push`
- `destroy()` - снять monkey-patch с `dataLayer.push`

#### Дождаться события

```js
import { firstValueFrom } from "rxjs";

const dataLayerWatcher = createDataLayerWatcher();

const viewItem = await firstValueFrom(dataLayerWatcher.event$("view_item"));

console.log("view_item:", viewItem);
```

С таймаутом:

```js
import { firstValueFrom, timeout } from "rxjs";

await firstValueFrom(
  dataLayerWatcher.event$("begin_checkout").pipe(timeout({ first: 20000 })),
);
```

#### Подписаться на событие

```js
const dataLayerWatcher = createDataLayerWatcher();

const subscription = dataLayerWatcher
  .event$("view_item")
  .subscribe((eventData) => {
    console.log("view_item:", eventData);
  });

subscription.unsubscribe();
```

#### Слушать все dataLayer-события

```js
const dataLayerWatcher = createDataLayerWatcher();

const subscription = dataLayerWatcher.dataLayer$.subscribe(
  ({ item, source }) => {
    console.log(`[dataLayer:${source}]`, item);
  },
);

subscription.unsubscribe();
```

Если replay не нужен:

```js
const subscription = dataLayerWatcher
  .freshEvent$("view_item")
  .subscribe((item) => console.log(item));
```

#### Получить последнее событие из истории

```js
import { firstValueFrom } from "rxjs";

const dataLayerWatcher = createDataLayerWatcher();
const viewItem = await firstValueFrom(dataLayerWatcher.event$("view_item"));
```

#### Реагировать только на новый hotel id

```js
import { distinctUntilChanged, map } from "rxjs";

const dataLayerWatcher = createDataLayerWatcher();

const subscription = dataLayerWatcher
  .event$("view_item")
  .pipe(
    map((eventData) => ({
      eventData,
      hotelId: eventData?.ecommerce?.items?.[0]?.item_id,
    })),
    distinctUntilChanged((prev, next) => prev.hotelId === next.hotelId),
  )
  .subscribe(({ eventData, hotelId }) => {
    console.log("New hotelId:", hotelId);
  });
```

#### Отключить watcher

```js
const dataLayerWatcher = createDataLayerWatcher();

dataLayerWatcher.destroy();
```

### DOM + dataLayer together

#### Запустить код, когда готов DOM и пришел `view_item`

```js
import { combineLatest, filter, map } from "rxjs";

const domWatcher = reactDomObserver();
const dataLayerWatcher = createDataLayerWatcher();

const subscription = combineLatest([
  domWatcher
    .observeSelector$('[class*="PhotoGalleryMainCarousel_mainSwiperContainer"]')
    .pipe(
      filter(({ type }) => type !== "remove"),
      map(({ element }) => element),
    ),
  dataLayerWatcher.event$("view_item"),
]).subscribe(([gallery, viewItem]) => {
  console.log("DOM ready:", gallery);
  console.log("dataLayer ready:", viewItem);
});
```

#### Один раз отработать и завершить

```js
import { combineLatest, filter, map, take } from "rxjs";

const domWatcher = reactDomObserver();
const dataLayerWatcher = createDataLayerWatcher();

combineLatest([
  domWatcher.observeSelector$('[class*="PhotoGalleryMainCarousel"]').pipe(
    filter(({ type }) => type !== "remove"),
    map(({ element }) => element),
  ),
  dataLayerWatcher.event$("view_item"),
])
  .pipe(take(1))
  .subscribe(([gallery, viewItem]) => {
    if (gallery.dataset.customFeatureInitialized) return;

    gallery.dataset.customFeatureInitialized = "true";

    // initFeature(gallery, viewItem);
  });
```

### Практичные сценарии

#### Вставить блок один раз после появления контейнера

```js
const domWatcher = reactDomObserver();

domWatcher.added$('[class*="HotelInfo"]').subscribe(({ element }) => {
  insertOnce(
    element,
    "beforeend",
    '<div class="custom-info">Подборка для семейного отдыха</div>',
    "family-info-block",
  );
});
```

#### Сохранить событие в localStorage с TTL

```js
const dataLayerWatcher = createDataLayerWatcher();

dataLayerWatcher.event$("purchase").subscribe((eventData) => {
  setLocalStorageWithExpiry("last_purchase_event", eventData, 1);
});
```

#### Восстановить последнее сохраненное событие

```js
const cachedPurchase = getLocalStorageWithExpiry("last_purchase_event");

if (cachedPurchase) {
  console.log("Cached purchase:", cachedPurchase);
}
```

## Гигиена репозитория

Этот репозиторий состоит из множества mini-experiments для Mindbox. Главная цель правил - не мешать быстрым экспериментам, но держать дерево проекта читаемым.

### Правила

- Новые папки называем в `kebab-case`: `promo-banner`, `sunmar-popup-test`.
- Не используем пробелы в именах папок.
- Не храним `node_modules` и `dist` в git.
- Не оставляем `.DS_Store`.
- Временные файлы `temp`, `tmp` либо удаляем, либо явно описываем в `Notes` каталога.
- `console.log` и `debugger` оставляем только осознанно и убираем перед публикацией.
- Брендовые эксперименты храним в `brands/coral/*` и `brands/sunmar/*`.
- Небрендовые или служебные проекты выносим в `special/*`.
- Новый эксперимент создаем через `npm run create:experiment`.
- Новый эксперимент запускаем и собираем из корня через `dev:experiment` и `build:experiment`.
- В новых экспериментах не создаем локальные `package.json` и `vite.config.js`.
- Каталог проектов обновляем через `npm run update:catalog`.

### Проверка

```bash
npm run check:hygiene
```

Команда только показывает отчет и ничего не удаляет.

### Почему не удалять автоматически

В репозитории много локальных экспериментов. Автоматическое удаление `dist` или временных файлов может мешать текущей работе. Поэтому сначала смотрим отчет, затем отдельно принимаем решение, что чистить.

## Каталог проектов

Каталог формируется автоматически:

```bash
npm run update:catalog
```

Актуальный список находится в [projects-catalog.md](./projects-catalog.md).
