# black-friday-2026-november-popup

Mindbox experiment based on Vite and vite-plugin-monkey.

## Settings

- Brand: `sunmar`
- Match: `https://www.sunmar.ru/*`
- Entry: `src/main.js`
- Styles: `src/style.scss`

## Commands

```bash
npm run dev:experiment -- brands/sunmar/black-friday-2026-november-popup
npm run build:experiment -- brands/sunmar/black-friday-2026-november-popup
```

## Files

- `src/main.js` - entry point.
- `src/markup.html` - experiment markup.
- `src/style.scss` - experiment styles.
- `src/scripts/initSearchTrigger.js` - startup and HMR cleanup.
- `src/scripts/initWidget.js` - popup insertion and opening.
- `src/scripts/search/` - route checks, date checks, form reading, and polling.
- `src/scripts/popup/` - closing, listener cleanup, and focus restoration.
- `src/scripts/metric/` - Yandex Metrika action tracking.
- `src/scripts/utils/keys.js` - markup and insertion selector.
- `test/` - date conditions and polling lifecycle checks using direct module imports.
- `experiment.config.json` - config for root-level `dev:experiment` and `build:experiment`.

## Popup behavior

The popup opens only on Sunmar search-result routes `/packagetours/` or `/onlyhotel/` with a non-empty `qp` parameter, when the visible search date fields match the promotion dates. It is inserted once into `document.body` as a native modal dialog in the center of the viewport, with a dark backdrop. Its design size is 427 × 203 px; narrow screens retain 16 px side margins. The background is inert while the dialog is open. The close button and Escape dismiss it and restore previous focus. Closing keeps the insertion flag, so repeated initialization does not reopen it on the same page. The entrance animation respects `prefers-reduced-motion`.

The action preserves the existing Sunmar destination and sends the `entry_point` Yandex Metrika goal when `window.ym` is available. Typography reuses the host page's Manrope and Museo Sans fonts.

The card background loads from `https://b2ccdn.sunmar.ru/content/poup-chemodan.webp` with `cover` sizing and bottom alignment. The close icon remains a local SVG in `src/assets/` embedded in the build.

## Search trigger

Dates are read directly from the visible search form: `input[date-range="start"]` and `input[date-range="end"]` inside the same `.ant-picker-range`. The trigger does not depend on `dataLayer`.

For tours, both boundaries of the selected departure range must fall within 22–26 November 2026 inclusive. For hotel-only searches, the arrival date must fall within that period; checkout is not restricted. The current visible field values are used, including edits made while on a search-result page.

Fields and the URL are checked immediately and every 500 ms to support delayed form rendering and React value updates. Polling stops when the popup is shown or the page is unloaded. Closing prevents another display until reload.

Run checks from the experiment directory: `node --test test/searchConditions.test.js test/searchTrigger.test.js`.
