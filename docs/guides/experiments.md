# Работа с экспериментами

## Расположение

- `brands/coral/*` — Coral;
- `brands/sunmar/*` — Sunmar;
- `special/*` — общие и служебные эксперименты.

Каждая папка является отдельным мини-проектом со своей конфигурацией, entry-файлом и внутренней структурой.

## Создание

```bash
npm run create:experiment -- experiment-name --brand coral
```

Доступные площадки:

```bash
npm run create:experiment -- experiment-name --brand coral
npm run create:experiment -- experiment-name --brand sunmar
npm run create:experiment -- experiment-name --brand both
```

Entry по умолчанию — `src/main.js`. Альтернативный entry:

```bash
npm run create:experiment -- experiment-name --brand coral --entry home
```

Стиль по умолчанию — CSS. Для SCSS:

```bash
npm run create:experiment -- experiment-name --brand coral --style scss
```

## Конфигурация

Минимальный `experiment.config.json`:

```json
{
  "name": "comment-injection",
  "entry": "src/main.js",
  "brand": "coral",
  "match": ["https://www.coral.ru/*"]
}
```

Конфигурации проверяются командой:

```bash
npm run validate:configs
```

## Запуск и сборка

```bash
npm run dev:experiment -- brands/coral/comment-injection
npm run build:experiment -- brands/coral/comment-injection
```

Можно использовать короткое имя, если оно уникально.

В эксперименте не создаются локальные `node_modules`, `package.json` или `vite.config.*`. Общие зависимости и pipeline находятся в корне репозитория.

## Внутренняя структура

Для небольшого эксперимента достаточно:

```text
experiment.config.json
src/
  main.js
  style.css
```

Если логика растёт, разделяй её по назначению:

```text
src/
  main.js
  config/
  lib/
  modules/
  markup.html
  style.scss
```

Логика одного эксперимента остаётся внутри него. В корневой `utils` она переносится только при реальном повторном использовании несколькими проектами.

## Анализ конкретного эксперимента

```bash
npm run graph:experiment -- brands/coral/comment-injection
```

Агент сначала читает точечную карту, затем только связанные файлы. После структурных изменений карта генерируется повторно.
