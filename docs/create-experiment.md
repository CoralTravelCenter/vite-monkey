# Создание Mindbox-эксперимента

Новый эксперимент создается из корня репозитория:

```bash
npm run create:experiment -- experiment-name --brand coral
```

## Базовые варианты

```bash
npm run create:experiment -- experiment-name --brand coral
npm run create:experiment -- experiment-name --brand sunmar
npm run create:experiment -- experiment-name --brand both
```

Для своего `match`:

```bash
npm run create:experiment -- experiment-name --brand custom --match "https://example.com/*"
```

## Entry file

По умолчанию создается `src/main.js`.

```bash
npm run create:experiment -- experiment-name --brand coral --entry home
```

Допустимые значения:

- `main`
- `home`

## CSS или SCSS

По умолчанию создается `src/style.css`.

```bash
npm run create:experiment -- experiment-name --brand coral --style scss
```

При `--style scss` локальные зависимости не добавляются. `sass` уже установлен в корне репозитория.

## Запуск и сборка

Новые эксперименты можно запускать из корня репозитория:

```bash
npm run dev:experiment -- experiment-name
npm run build:experiment -- experiment-name
```

В папке нового эксперимента больше нет локальных `package.json`, `vite.config.js` и `node_modules`. Инфраструктура сборки общая и живет в корне.

## Зачем это нужно

Так новые эксперименты стартуют одинаково: единая структура, один общий `vite`, один общий `vite-plugin-monkey`, понятные команды запуска и меньше ручного копирования из старых папок.
