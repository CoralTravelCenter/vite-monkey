# Каталог проектов

Этот файл фиксирует текущие mini-experiments в репозитории. Статус `needs-review` означает, что проект найден автоматически, но его реальное состояние нужно подтвердить вручную.

## Статусы

- `active` - используется сейчас.
- `experiment` - гипотеза или временный тест.
- `archive` - больше не используется, но оставлен для истории.
- `needs-review` - статус пока неизвестен.

## Как обновлять

При разборе проекта меняем `Status` и дополняем `Notes`: где используется, кто владелец, можно ли архивировать, есть ли связанные задачи.

Автоматическое обновление списка проектов:

```bash
npm run update:catalog
```

Скрипт сохраняет ручные значения `Status` и `Notes` для уже известных путей.

## Проекты

| Path | Name | Area | Status | Entry | Match | Notes |
|---|---|---|---|---|---|---|
| `brands/coral/a_b-fast-lead` | `a-b-fast-lead` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/add-passeger-a-b` | `add-passeger-a-b` | coral | needs-review | `src/main.js` | `https://www.coral.ru/booking/add-passenger/*` | has experiment.config.json |
| `brands/coral/add-passenger-sidebar-test` | `add-passenger-sidebar-test` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/atlantis-promo` | `atlantis-promo` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/bilety-podojdut` | `bilety-podojdut` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/bitrix-backend-payload` | `bitrix-backend-payload` | coral | needs-review | `src/main.js` | `https://www.coral.ru/corporate-clients-club/*` | has experiment.config.json |
| `brands/coral/bitrix-on-flight-page` | `bitrix-on-flight-page` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/black-friday-2025-landing` | `black-friday-2025-landing` | coral | needs-review | `src/main.js` | `https://www.coral.ru/monkey/` | has experiment.config.json |
| `brands/coral/busines-turkey-popup` | `busines-turkey-popup` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/carousel-metrika` | `carousel-metrika` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | has experiment.config.json |
| `brands/coral/cb-tooltip` | `cb-tooltip` | coral | needs-review | `src/main.js` | `https://b2cpilotui.coral.ru/*` | has experiment.config.json |
| `brands/coral/chernaya-pyatnica/link` | `chernaya-pyatnica-link` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/china-form` | `china-form` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/clean-screen` | `clean-screen` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | has experiment.config.json |
| `brands/coral/close-jivo-2025` | `close-jivo-2025` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/comment-injection` | `comment-injection` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/coral-group-landing` | `coral-group-landing` | coral | needs-review | `src/main.js` | `https://www.coral.ru/monkey/` | has experiment.config.json |
| `brands/coral/coral-popup-cyber-promo` | `coral-popup` | coral | needs-review | `src/home.js` | `https://www.coral.ru/` | package name duplicates `coral-popup`; package name does not match folder; has experiment.config.json; project name duplicates `coral-popup`; project name does not match folder |
| `brands/coral/coral-search-tweeks` | `coral-search-tweeks` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/coral-tax-shild` | `redirect-to-new-site` | coral | needs-review | `src/home.js` | `https://new.coral.ru/hotels/bahrain/swiss-belhotel-seef-bahrain-seef/?qp=lWOJw1XDa14WeujkN6zDTrTzWWKAniWQbAbKEbIb2fjAEjMHo2RZYlS7BjLMnN7N7KC8wbdIKR1HIJ17r9SS%2FsrEdAsIdgvE2cwbRtrjupQ6S%2BLo%2Fq7g%2BKzWZpaXPll8nVktM3cnxNeWzzo%2FdvGPN5eItXPds8RPcEyNQOFMv6I3U9XPkTvpUrX0IG6917qxcxU1B5k70qGsEZ0ZdvcUqsb6QRJZO3XJmkV1y0uX2v7AH5U5wD7wO4q1%2BD67phsrxNuZQjLyIHaKNFhbBoAyySMl8tA%2F%2Fm3e2Vc2F5b3ldg%3D&p=1&w=null&s=5&hlu=packagetours%2Fmoskva-to-bahreyn-tours&hlqp=lWOJw1XDa14WeujkN6zDTrTzWWKAniWQbAbKEbIb2fjAEjMHo2RZYlS7BjLMnN7N7KC8wbdIKR1HIJ17r9SS%2FsrEdAsIdgvE2cwbRtrjupQ6S%20Lo%2Fq7g%20KzWZpaXPll8hFaQdJRrGY5fKHvI5zkcpE%2FwXjEotcRjnaqM0ag%2FSHhECB9wz39Uh5cdVAzHUZCoYIwTyPzDK7wOuHTftLPIZtBcmk%20oygkfpv8gfUgBTfpNRK7%20PLHJR%2FcC8F2y690n%2FgiifRgcqTmlsQc3aMtYkw%3D%3D` | package name duplicates `redirect-to-new-site`; package name does not match folder; has experiment.config.json; project name duplicates `redirect-to-new-site`; project name does not match folder |
| `brands/coral/filters-desintegration` | `filters-desintegration` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/gipoteza-karusel-napravleniya` | `gipoteza-karusel-napravleniya` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/gnb` | `gnb` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/hello-banner-main-russia` | `hello-banner-main-russia` | coral | needs-review | `src/home.js` | `https://www.coral.ru/main/russia/` | has experiment.config.json |
| `brands/coral/hide-email-checkbox` | `hide-email-checkbox` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/home-page-advantage` | `home-page-advantage` | coral | needs-review | `src/home.js` | `https://www.coral.ru/` | has experiment.config.json |
| `brands/coral/hotels-set-redisign` | `hotels-set-redisign` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/jivo-ab` | `jivo-ab` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/jivo-desktop-2025` | `jivo-desktop-2025` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | has experiment.config.json |
| `brands/coral/jpoint-search-banner` | `jpoint-search-banner` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/june-aside` | `june-aside` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/june-aside-mob` | `june-aside-mob` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/june-popup-family` | `june-popup-family` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/june-shild` | `june-shild` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/june-stories` | `june-stories` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/kalendar-vigod/home-page` | `kalendar-vigod-home-page` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/kalendar-vigod/link` | `kalendar-vigod-link` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/kalendar-vigod/popup` | `kalendar-vigod-popup` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/kalendar-vigod/search-card` | `kalendar-vigod-search-card` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/kalendar-vigod/ym-banner` | `kalendar-vigod-ym-banner` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/lead-form-add-passegers` | `lead-form-add-passegers` | coral | needs-review | `src/home.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/lead-form-bitrix-24-coralby` | `lead-form-bitrix-24-coralby` | coral | needs-review | `src/home.js` | `https://www.coral.by/*` | has experiment.config.json |
| `brands/coral/magic-ball` | `magic-ball` | coral | needs-review | `src/main-mob.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/mindbox-subscribe-2025` | `mindbox-subscribe-2025` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/new-year-ticker` | `new-year-ticker` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | has experiment.config.json |
| `brands/coral/ny-popup` | `ny-popup` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | has experiment.config.json |
| `brands/coral/one-click-tweeks` | `one-click-tweeks` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/only-hotel-highlight-2025/highlight-popup` | `highlight-popup` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/only-hotel-highlight-2025/link-highlight` | `link-highlight` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/only-hotel-highlight-2025/ribbon` | `ribbon` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/only-hotel-highlight-2025/shild` | `shild` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/only-hotel-shild-v2` | `only-hotel-shild-v2` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/oplata-bez-komisii` | `oplata-bez-komisii` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/package-ctx` | `package-ctx` | coral | needs-review | `src/main.ts` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/pay-attention-slider-fix` | `pay-attention-slider-fix` | coral | needs-review | `src/home.js` | `https://www.coral.ru/preview/360f3d83-7c9d-45d3-8fe0-1d77a98259db/ru-RU/` | has experiment.config.json |
| `brands/coral/payment-page-ui-improov` | `payment-page-ui-improov` | coral | needs-review | `src/main.js` | `https://www.coral.ru/payment/*` | has experiment.config.json |
| `brands/coral/podborky-cen` | `podborky-cen` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/popup-attention-uae` | `popup-attention-uae` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/promo-tooltip` | `promo-tooltip` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | package name duplicates `promo-tooltip`; has experiment.config.json; project name duplicates `promo-tooltip` |
| `brands/coral/promo-tooltip-mobile` | `promo-tooltip` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | package name duplicates `promo-tooltip`; package name does not match folder; has experiment.config.json; project name duplicates `promo-tooltip`; project name does not match folder |
| `brands/coral/push-notify` | `push-notify` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/rb-home-markup` | `rb-home-markup` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/rb-popup-aside` | `rb-popup-aside` | coral | needs-review | `src/main.js` | `https://www.coral.ru/main/turkey/*` | has experiment.config.json |
| `brands/coral/renovation` | `renovation` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/search-banner-css-fix` | `search-banner-css-fix` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/search-research` | `search-research` | coral | needs-review | `src/home.js` | `https://www.coral.ru/poleznaya-informatsiya/offers/start-prodazh-vietnam/*` | has experiment.config.json |
| `brands/coral/search-shild-universal` | `search-shild-universal` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/SGN-airport-message` | `sgn-airport-message` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/stories test` | `stories-test` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | path has spaces; package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/coral/t-bank` | `t-bank` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/t-bank-payment-banner` | `t-bank-payment-banner` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/test-form-subscribe` | `test-form-subscribe` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | has experiment.config.json |
| `brands/coral/test-pilot-subscribe` | `test-pilot-subscribe` | coral | needs-review | `src/main.js` | `https://b2cpilotui.coral.ru/` | has experiment.config.json |
| `brands/coral/thankyou-subscribition` | `thankyou-subscribition` | coral | needs-review | `src/main.js` | `https://www.coral.ru/monkey/*` | has experiment.config.json |
| `brands/coral/timer-rb-home` | `timer-rb-home` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/tiny-search` | `tiny-search` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/uae-attention` | `uae-attention` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/url-decrypt` | `url-decrypt` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/url-listener` | `url-listener` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/utm-switch-blocks` | `utm-switch-blocks` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/ux-mobile-menu` | `ux-mobile-menu` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/ux-mobile-popup` | `ux-mobile-popup` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/video-banner-carousel` | `video-banner-carousel` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/welcome-to-app` | `welcome-to-app` | coral | needs-review | `src/main.js` | `https://www.coral.ru/*` | has experiment.config.json |
| `brands/coral/welcome-to-app-potap` | `welcome-to-app-potap` | coral | needs-review | `src/main.js` | `https://www.coral.ru/` | has experiment.config.json |
| `brands/coral/ym-test` | `ym-test` | coral | needs-review | `src/home.js` | `https://www.coral.ru/preview/1c107d6f-4240-4adc-88e4-30b0ff8563da/ru-RU/` | has experiment.config.json |
| `brands/sunmar/black-friday-links` | `black-friday-links` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/bobr quiz` | `bobr-quiz` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | path has spaces; package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/sunmar/bobr-aside` | `bobr-aside` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/bobr-pipka` | `bobr-pipka` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/bobr-skvoz` | `bobr-skvoz` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | package name duplicates `bobr-skvoz`; has experiment.config.json; project name duplicates `bobr-skvoz` |
| `brands/sunmar/bobr-skvoz-mob` | `bobr-skvoz` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | package name duplicates `bobr-skvoz`; package name does not match folder; has experiment.config.json; project name duplicates `bobr-skvoz`; project name does not match folder |
| `brands/sunmar/fantiet-block` | `fantiet-block` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/lead-form` | `lead-form` | sunmar | needs-review | `src/home.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/lead-form-bitrix-24` | `lead-form-bitrix-24` | sunmar | needs-review | `src/home.js` | `https://www.sunmar.ru/info-actions/` | has experiment.config.json |
| `brands/sunmar/magic-promo-sunmar/info-actions` | `magic-promo-sunmar-info-actions` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/info-actions/` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/sunmar/magic-promo-sunmar/link` | `magic-promo-sunmar-link` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/sunmar/magic-promo-sunmar/link-mobile` | `link-mobile` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/` | has experiment.config.json |
| `brands/sunmar/magic-promo-sunmar/popup` | `magic-promo-sunmar-popup` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | package name does not match folder; has experiment.config.json; project name does not match folder |
| `brands/sunmar/magic-promo-sunmar/search-metrika` | `search-metrika` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/midbox-quiz-css-fix` | `midbox-quiz-css-fix` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/onlyhotel-sunmar-hightlight-2025` | `onlyhotel-sunmar-hightlight-2025` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/popup-management` | `popup-management` | sunmar | needs-review | `src/home.js` | `https://www.sunmar.ru/info-actions/` | has experiment.config.json |
| `brands/sunmar/promo-popup` | `promo-popup` | sunmar | needs-review | `src/home.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/redirect-to-new-site` | `redirect-to-new-site` | sunmar | needs-review | `src/home.js` | `https://www.sunmar.ru/` | package name duplicates `redirect-to-new-site`; has experiment.config.json; project name duplicates `redirect-to-new-site` |
| `brands/sunmar/secret-popup` | `secret-popup` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sm-form-adaptive-height` | `sm-form-adaptive-height` | sunmar | needs-review | `src/home.js` | `https://new.sunmar.ru/` | has experiment.config.json |
| `brands/sunmar/sunmar-bf-shilds` | `sunmar-bf-shilds` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sunmar-bf-shilds-hotel` | `sunmar-bf-shilds-hotel` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sunmar-bobr-quiz` | `sunmar-bobr-quiz` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sunmar-bonus-shild-search` | `sunmar-bonus-shild-search` | sunmar | needs-review | `src/home.js` | `https://www.sunmar.ru/` | has experiment.config.json |
| `brands/sunmar/sunmar-egei-quiz-2025` | `sunmar-egei-quiz-2025` | sunmar | needs-review | `src/home.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sunmar-home-page-polish` | `home-page-polish` | sunmar | needs-review | `src/home.js` | `https://new.sunmar.ru/` | has experiment.config.json |
| `brands/sunmar/sunmar-mindbox-subscribe` | `sunmar-mindbox-subscribe` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sunmar-onlyhotel-higlight` | `sunmar-onlyhotel-higlight` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sunmar-popup-cyber-promo` | `coral-popup` | sunmar | needs-review | `src/home.js` | `https://www.sunmar.ru/` | package name duplicates `coral-popup`; package name does not match folder; has experiment.config.json; project name duplicates `coral-popup`; project name does not match folder |
| `brands/sunmar/sunmar-popup-ne-otkladivy` | `sunmar-popup-ne-otkladivy` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sunmar-shild-new` | `sunmar-shild-new` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/sunmar-video-kv` | `sunmar-video-kv` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/monkey/*` | has experiment.config.json |
| `brands/sunmar/turkey-vs-egypt` | `turkey-vs-egypt` | sunmar | needs-review | `src/main.js` | `https://www.sunmar.ru/*` | has experiment.config.json |
| `brands/sunmar/youth_day_2025_entry` | `youth-day-2025-entry` | sunmar | needs-review | `src/search-shield.js` | `https://www.sunmar.ru/*` | package name does not match folder; has experiment.config.json; project name does not match folder |
