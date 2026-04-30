# Split utils package

Файл `utils.js` разбит на небольшие модули по смыслу.

## Главная точка входа

```js
import {
  createSelectorWatcher,
  createDataLayerWatcher,
  waitSelector,
  insertOnce,
} from './utils/index.js';
```

## Структура

```txt
utils/
  index.js
  storage.js
  lifecycle.js
  environment.js
  clipboard.js
  url.js
  next.js
  id.js
  network.js
  hotels.js
  dom/
  analytics/
  media/
  cookies/

docs/
  watchers-examples.md
```

## Зависимости для новых reactive watchers

```bash
npm install rxjs selector-observer
```
