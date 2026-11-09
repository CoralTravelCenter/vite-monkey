# sunmar-faq-and-button-new-position

Mindbox experiment based on Vite and vite-plugin-monkey.

## Settings

- Brand: `sunmar`
- Match: `https://www.sunmar.ru/*`
- Entry: `src/main.js`
- Styles: `src/styles/style.scss`

## Commands

```bash
npm run dev:experiment -- brands/sunmar/sunmar-faq-and-button-new-position
npm run build:experiment -- brands/sunmar/sunmar-faq-and-button-new-position
```

## Files

- `src/main.js` - entry point.
- `src/markup.html` - empty div inserted at the original button position.
- `src/scripts/layoutOptions/reservationLayout.js` - submit button placement and insurance carousel visibility.
- `src/styles/style.scss` - experiment styles.
- `experiment.config.json` - config for root-level `dev:experiment` and `build:experiment`.

## Поведение

На всех шагах, где есть `[data-testid="rsb-container"]` и карточка
`ProductSummary_productSummaryCard__*`, существующий контейнер кнопки переносится
сразу после карточки. На исходное место вставляется пустой `div` из `src/markup.html`.
Кнопка не клонируется. Перенесённый контейнер получает вертикальные отступы
`--sunmar-margin-l` (по умолчанию 24 px), на экранах до 767 px —
`--sunmar-margin-n` (по умолчанию 16 px). При возврате кнопки эти стили снимаются.

На шаге заказчика (есть `[data-testid="cf-surname-input"]`) кнопки возврата и
продолжения внутри перенесённого контейнера расположены в столбик, на всю ширину,
с промежутком 12 px. Сначала отображается кнопка продолжения, затем — возврата.
На этом шаге блок FAQ из `markup.html` скрыт и не занимает места. На первом шаге
он остаётся видимым; при возвращении с шага заказчика скрытие снимается автоматически.

Скрывается только `.glide__track[data-glide-el="track"]`, содержащий все три заголовка:
«Медицинская страховка», «Страхование от невыезда», «Условия страхования».
Остальные карусели сохраняются.

Изменения повторно применяются при обновлении DOM. При остановке эксперимента
кнопка возвращается на исходное место, а скрытие страховок отменяется.
Старая логика FAQ отключена в `initWidget.js`: удалённые `markup1.html` и
`markup2.html` больше не нужны для запуска и сборки. Сохранённые файлы старой
логики FAQ не подключены к точке входа.
