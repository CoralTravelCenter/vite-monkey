# coral-faq-and-button-new-position

Mindbox experiment based on Vite and vite-plugin-monkey.

## Settings

- Brand: `coral`
- Match: `https://www.coral.ru/*`
- Entry: `src/main.js`
- Styles: `src/styles/accordeons_styles.css`

## Commands

```bash
npm run dev:experiment -- brands/coral/coral-faq-and-button-new-position
npm run build:experiment -- brands/coral/coral-faq-and-button-new-position
```

## Files

- `src/main.js` - entry point.
- `src/markup.html` - experiment markup.
- `src/styles/accordeons_styles.css` - experiment styles.
- `experiment.config.json` - config for root-level `dev:experiment` and `build:experiment`.

## Поведение на странице бронирования

- Кнопки в итоговой карточке вызывают соответствующие кнопки штатного виджета. Их текст и состояние обновляются при смене шага.
- FAQ показывается на шаге дополнительных услуг. Карусель скрывается, если в ней присутствуют все три страховые карточки.
- Цели Метрики отправляются на счётчик Coral. Показ учитывается один раз за сессию, а открытие — один раз для каждого вопроса до повторного создания FAQ.
