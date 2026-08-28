# Документация Vite Monkey

Документация разделена по задачам. Начинай с минимального раздела, необходимого для текущей работы.

## Быстрый старт

```bash
npm install
npm run dev:experiment -- brands/coral/experiment-name
npm run build:experiment -- brands/coral/experiment-name
```

## Руководства

- [Работа с экспериментами](./guides/experiments.md) — создание, конфигурация, запуск и внутренняя структура мини-проекта.

## Архитектура

- [Dev/build pipeline](./architecture/dev-build-pipeline.md) — единый runner, изоляция, staging и атомарная публикация.
- [Анализ архитектуры](./architecture/architecture-analysis.md) — Graphify, компактная карта проекта и карта эксперимента.

## Справочники

- [Utils: публичный API](./reference/utils.md) — общие функции, сгруппированные по ролям.
- [Watchers](./reference/watchers.md) — RxJS, `selector-observer`, Promise-адаптеры и lifecycle подписок.
- [Каталог проектов](./projects-catalog.md) — автоматически сформированный список экспериментов.

## Обслуживание

- [Обслуживание репозитория](./maintenance/repository.md) — hygiene, проверки, каталог и контролируемые миграции.

## Источники истины

- команды запуска и зависимости — корневой `package.json`;
- конфигурация проекта — его `experiment.config.json`;
- публичные экспорты utils — `utils/index.js`;
- автоматически сформированный список проектов — `docs/projects-catalog.md`;
- машинные архитектурные карты — `.architecture/` и `graphify-out/`.
