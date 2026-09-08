# sunmar-faq-hotel-reservation-additional-service

Mindbox experiment based on Vite and vite-plugin-monkey.

## Settings

- Brand: `sunmar`
- Match: `https://www.sunmar.ru/*`
- Entry: `src/main.js`
- Styles: `src/style.scss`

## Commands

```bash
npm run dev:experiment -- brands/sunmar/sunmar-faq-hotel-reservation-additional-service
npm run build:experiment -- brands/sunmar/sunmar-faq-hotel-reservation-additional-service
```

## Files

- `src/main.js` - entry point.
- `src/markup1.html` - FAQ for the additional services step.
- `src/markup2.html` - FAQ for the customer step.
- `src/scripts/targetingBlock/checkStep.js` - active booking step detection.
- `src/style.scss` - experiment styles.
- `experiment.config.json` - config for root-level `dev:experiment` and `build:experiment`.
