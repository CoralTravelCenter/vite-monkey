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
- `--brand custom` -> `special/promo-banner`

Дополнительные примеры:

```bash
npm run create:experiment -- promo-banner --brand sunmar
npm run create:experiment -- promo-banner --brand coral --entry home
npm run create:experiment -- promo-banner --brand coral --style scss
npm run create:experiment -- promo-banner --brand custom --match "https://example.com/*"
```

## Какие скрипты есть

### `npm run create:experiment -- <name> ...`

Создает новый эксперимент из шаблона в `templates/monkey-experiment`.

### `npm run dev:experiment -- <path-or-name>`

Генерирует временный Vite config и запускает dev server для выбранного эксперимента.

### `npm run build:experiment -- <path-or-name>`

Генерирует временный Vite config и собирает userscript в `dist/` внутри конкретного эксперимента.

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

Перестраивает [docs/projects-catalog.md](/Users/mike/Documents/GitHub/vite-monkey/docs/projects-catalog.md) на основе реальной структуры проекта.

### `npm run migrate:structure`

Служебный скрипт для миграции legacy-репозитория:

- создает `experiment.config.json`
- убирает локальные `package.json`, `package-lock.json`, `vite.config.*`
- раскладывает проекты по `brands/*` и `special/*`

Обычно нужен один раз или для повторной миграции старых папок.

## Как теперь устроен запуск

1. `scripts/run-experiment.js` находит проект по пути или короткому имени.
2. Читает `experiment.config.json`.
3. Генерирует временный config в `.vite-monkey-runner/`.
4. Запускает корневой `vite` с `vite-plugin-monkey`.
5. Готовый `dist` попадает в папку самого эксперимента.

## Конфиг эксперимента

Минимальный формат `experiment.config.json`:

```json
{
  "name": "comment-injection",
  "entry": "src/main.js",
  "brand": "coral",
  "match": [
    "https://www.coral.ru/*"
  ]
}
```

## Документация

- [docs/create-experiment.md](/Users/mike/Documents/GitHub/vite-monkey/docs/create-experiment.md)
- [docs/repository-hygiene.md](/Users/mike/Documents/GitHub/vite-monkey/docs/repository-hygiene.md)
- [docs/projects-catalog.md](/Users/mike/Documents/GitHub/vite-monkey/docs/projects-catalog.md)
- [docs/utils-examples.md](/Users/mike/Documents/GitHub/vite-monkey/docs/utils-examples.md)
- [docs/watchers-examples.md](/Users/mike/Documents/GitHub/vite-monkey/docs/watchers-examples.md)
