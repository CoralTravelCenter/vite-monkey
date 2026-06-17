# ab-test-home-shorten

Mindbox experiment based on Vite and vite-plugin-monkey.

## Settings

- Brand: `sunmar`
- Match: `https://www.sunmar.ru/*`
- Entry: `src/main.js`
- Styles: `src/style.css`

## Commands

```bash
npm run dev:experiment -- brands/sunmar/ab-test-home-shorten
npm run build:experiment -- brands/sunmar/ab-test-home-shorten
```

## Files

- `src/main.js` - entry point.
- `src/markup.html` - experiment markup.
- `src/style.css` - experiment styles.
- `experiment.config.json` - config for root-level `dev:experiment` and `build:experiment`.
