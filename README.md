# Vite Monkey Repository

Репозиторий мини-экспериментов на Vite и `vite-plugin-monkey` для Coral и Sunmar.

## Быстрый старт

```bash
npm install
npm run dev:experiment -- brands/coral/comment-injection
npm run build:experiment -- brands/coral/comment-injection
```

Проект можно указать полным путём или уникальным коротким именем. Без аргумента терминал предложит выбрать площадку и эксперимент.

## Структура

```text
brands/
  coral/
  sunmar/
special/
scripts/
templates/
utils/
test/
docs/
```

- `brands/*` — брендовые эксперименты;
- `special/*` — общие и служебные эксперименты;
- `scripts/*` — единый dev/build runner и обслуживание репозитория;
- `templates/*` — шаблоны новых экспериментов;
- `utils/*` — общий публичный API через alias `@utils`;
- `test/*` — тесты общей инфраструктуры;
- `docs/*` — руководства, архитектура и справочники.

Каждая папка эксперимента является отдельным мини-проектом. Локальные `package.json`, `node_modules` и `vite.config.*` не используются.

## Создание эксперимента

```bash
npm run create:experiment -- promo-banner --brand coral
```

Доступные площадки: `coral`, `sunmar`, `both`. Entry по умолчанию — `main`, стиль — CSS.

```bash
npm run create:experiment -- promo-banner --brand sunmar --entry home
npm run create:experiment -- promo-banner --brand both --style scss
```

Подробности: [работа с экспериментами](./docs/guides/experiments.md).

## Основные команды

| Команда                                | Назначение                                   |
| -------------------------------------- | -------------------------------------------- |
| `npm run dev:experiment -- <проект>`   | Запустить Vite dev server с HMR              |
| `npm run build:experiment -- <проект>` | Собрать и проверить userscript               |
| `npm run clean:runner`                 | Показать и удалить выбранные stale workspace |
| `npm run check:pipeline`               | Проверить Coral, Sunmar и Both pipeline      |
| `npm run check:ci`                     | Запустить полный набор CI-проверок           |
| `npm run check:hygiene`                | Проверить гигиену репозитория                |
| `npm run update:catalog`               | Обновить каталог экспериментов               |
| `npm run graph:project`                | Построить компактную карту репозитория       |
| `npm run graph:experiment -- <проект>` | Построить карту эксперимента                 |
| `npm run graph:audit`                  | Выполнить полный Graphify-аудит              |

Dev и build используют отдельные Vite-конфигурации. Build проходит через изолированный staging, валидацию и атомарную публикацию в `dist`.

Подробности: [архитектура dev/build pipeline](./docs/architecture/dev-build-pipeline.md).

## Конфигурация эксперимента

```json
{
  "name": "comment-injection",
  "entry": "src/main.js",
  "brand": "coral",
  "match": ["https://www.coral.ru/*"]
}
```

## Документация

- [Навигация по документации](./docs/README.md)
- [Анализ архитектуры](./docs/architecture/architecture-analysis.md)
- [Публичный API utils](./docs/reference/utils.md)
- [RxJS и selector watchers](./docs/reference/watchers.md)
- [Каталог проектов](./docs/projects-catalog.md)
