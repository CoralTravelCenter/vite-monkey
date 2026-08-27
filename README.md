# Vite Monkey Repository

Репозиторий для mini-experiments на `vite` и `vite-plugin-monkey`.

## Как теперь устроен репозиторий

```txt
brands/
  coral/
  sunmar/

special/

scripts/
  lib/
  create-experiment.js
  run-experiment.js
  migrate-repository-structure.js
  check-hygiene.js
  update-projects-catalog.js

templates/
  monkey-experiment/

utils/
docs/
```

### Что где лежит

- `brands/coral/*` - эксперименты для Coral
- `brands/sunmar/*` - эксперименты для Sunmar
- `special/*` - небрандовые, служебные или отдельные проекты
- `templates/monkey-experiment` - шаблон для создания новых экспериментов
- `scripts/lib/*` - общая логика discovery и Vite runner
- `utils/*` - общие утилиты для DOM, analytics, network и других задач

## Как запускать проект

Локальные `package.json` и `vite.config.*` в экспериментах больше не используются. Все запускается из корня.

Во всех экспериментах доступен alias `@utils` на корневую папку [utils](./utils), так что можно писать:

```js
import { waitForElement, reactDomObserver } from "@utils";
```

### Установить зависимости

```bash
npm install
```

### Запустить эксперимент

```bash
npm run dev:experiment -- brands/coral/comment-injection
```

Можно указывать и короткое имя, если оно однозначно:

```bash
npm run dev:experiment -- comment-injection
```

### Собрать эксперимент

```bash
npm run build:experiment -- brands/coral/comment-injection
```

## Как создать новый эксперимент

```bash
npm run create:experiment -- promo-banner --brand coral
```

Новые проекты создаются так:

- `--brand coral` -> `brands/coral/promo-banner`
- `--brand sunmar` -> `brands/sunmar/promo-banner`
- `--brand both` -> `special/promo-banner`

Дополнительные примеры:

```bash
npm run create:experiment -- promo-banner --brand sunmar
npm run create:experiment -- promo-banner --brand coral --entry home
npm run create:experiment -- promo-banner --brand coral --style scss
```

## Какие скрипты есть

### `npm run create:experiment -- <name> ...`

Создает новый эксперимент из шаблона в `templates/monkey-experiment`.

### `npm run dev:experiment -- <path-or-name>`

Генерирует временный Vite config и запускает dev server для выбранного эксперимента.
Если проект не указан, предлагает выбрать площадку и эксперимент в терминале.

### `npm run build:experiment -- <path-or-name>`

Генерирует временный Vite config и собирает userscript в `dist/` внутри конкретного эксперимента.
Если проект не указан, предлагает выбрать площадку и эксперимент в терминале.

### `npm run clean:runner`

Показывает stale workspace и файлы прежнего runner, затем запрашивает
подтверждение перед удалением. Активные процессы не затрагиваются.

### `npm run check:pipeline`

Собирает и валидирует representative-проекты Coral, Sunmar и Both/Special.

### `npm run check:ci`

Запускает lint, typecheck, unit-тесты, проверку конфигураций и полную pipeline matrix.

### `npm run check:hygiene`

Показывает отчет по:

- `.DS_Store`
- `node_modules`
- `dist`
- временным файлам
- папкам с пробелами
- legacy `package.json` / `vite.config.*`
- `console.log` и `debugger` в `src/`

### `npm run update:catalog`

Перестраивает [docs/projects-catalog.md](./docs/projects-catalog.md) на основе реальной структуры проекта.

### `npm run migrate:structure`

Служебный скрипт для миграции legacy-репозитория:

- создает `experiment.config.json`
- убирает локальные `package.json`, `package-lock.json`, `vite.config.*`
- раскладывает проекты по `brands/*` и `special/*`

Обычно нужен один раз или для повторной миграции старых папок.

## Как теперь устроен запуск

1. `scripts/run-experiment.js` находит проект по пути или короткому имени.
2. Читает `experiment.config.json`.
3. Создаёт изолированный workspace запуска в `.vite-monkey-runner/`.
4. Передаёт управление отдельному dev или build pipeline.
5. Полностью удаляет workspace после завершения или ошибки.

Dev pipeline запускает Vite server с HMR и не создаёт staging или build-артефакты.
Для него генерируется Vite config только с server-настройками.
Первый сервер использует порт `5173`; если он занят, Vite автоматически и
безопасно выбирает следующий свободный порт (`5174`, `5175` и далее).

Build pipeline:

1. Собирает userscript во временный staging через `vite-plugin-monkey` и Oxc.
2. Финализирует JavaScript и проверяет metadata, match, имя и синтаксис.
3. Атомарно публикует файл в `dist`, сохраняя предыдущую сборку при ошибке.

Build использует отдельный Vite config со staging, Oxc и CSS-минификацией;
настройки dev server в него не попадают.

В dev-режиме `Ctrl+C` считается штатной остановкой сервера. В build-режиме
прерывание считается ошибкой, и userscript не публикуется.

## Конфиг эксперимента

Минимальный формат `experiment.config.json`:

```json
{
  "name": "comment-injection",
  "entry": "src/main.js",
  "brand": "coral",
  "match": ["https://www.coral.ru/*"]
}
```

## Документация

- [Единая документация](./docs/README.md)
- [Каталог проектов](./docs/projects-catalog.md)
