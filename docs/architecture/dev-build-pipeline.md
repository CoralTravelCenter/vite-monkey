# Dev/build pipeline

Все эксперименты используют единый Monkey pipeline из корня репозитория. Локальные `package.json` и `vite.config.*` внутри экспериментов не нужны.

## Общий вход

```text
scripts/run-experiment.js
  → выбор и проверка эксперимента
  → чтение experiment.config.json
  → создание изолированного workspace
  → запуск dev или build pipeline
  → очистка workspace
```

Проект можно передать полным путём или уникальным коротким именем:

```bash
npm run dev:experiment -- brands/coral/comment-injection
npm run build:experiment -- comment-injection
```

Без аргумента терминал предлагает выбрать площадку и эксперимент.

## Dev

Dev-режим запускает Vite с HMR и отдельной конфигурацией, содержащей только server-настройки.

Первый процесс пытается использовать порт `5173`. Если он занят, Vite выбирает следующий свободный порт, поэтому несколько экспериментов можно запускать одновременно.

Остановка через `Ctrl+C` считается штатной. Временный workspace удаляется после завершения процесса.

## Build

Build использует отдельную Vite-конфигурацию и не наследует настройки dev server.

```text
исходники эксперимента
  → vite-plugin-monkey
  → временный staging
  → финализация userscript
  → проверка metadata, match, имени и JavaScript
  → атомарная публикация в dist
```

Если сборка, проверка или публикация завершается ошибкой, предыдущий успешный userscript остаётся без изменений.

## Изоляция запусков

Каждый процесс получает собственную папку внутри `.vite-monkey-runner`. Параллельные dev/build-запуски не используют общий временный Vite config или staging.

Активные workspace не удаляются служебной очисткой. Для просмотра устаревших workspace используется:

```bash
npm run clean:runner
```

## Проверка pipeline

```bash
npm run check:pipeline
```

Команда собирает representative-проекты Coral, Sunmar и Both/Special.

Полный набор CI-проверок:

```bash
npm run check:ci
```
