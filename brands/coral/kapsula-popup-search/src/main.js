import popup from './markup.html?raw';
import './style.css';

import {PERSONALIZED_CONTENT_CONFIG} from './personalizedContentConfig.js';
import {createDataLayerWatcher} from "@utils";


const POPUP_SELECTOR = '#kapsula-popup-search';
const SHOW_DELAY = 10_000;

const dataLayerWatcher = createDataLayerWatcher();

let currentPath = window.location.pathname;
let isEliteService = false;
let routeTimer = null;
let routeTimePassed = false;
let popupShown = false;

function getContent(path) {
    const normalizedPath = String(path || '').toLowerCase();

    // console.log('[Kapsula] Проверяем route:', {
    //     path,
    //     normalizedPath,
    // });

    for (const group of PERSONALIZED_CONTENT_CONFIG) {
        const country = group.countries.find(({url}) =>
            normalizedPath.includes(url),
        );

        if (country) {
            // console.log('[Kapsula] Контент найден:', {
            //     group,
            //     country,
            // });

            return {
                group,
                country,
            };
        }
    }

    console.log('[Kapsula] Для route контент не найден');

    return null;
}

function tryShowPopup() {
    // console.log('[Kapsula] tryShowPopup:', {
    //     currentPath,
    //     isEliteService,
    //     routeTimePassed,
    //     popupShown,
    // });

    if (popupShown) {
        // console.log('[Kapsula] Popup уже был показан');
        return;
    }

    const content = getContent(currentPath);

    if (!content) {
        // console.log('[Kapsula] Стоп: route не подходит');
        return;
    }

    if (!isEliteService) {
        // console.log(
        //     '[Kapsula] Стоп: фильтр "Элит сервис" не выбран',
        // );
        return;
    }

    if (!routeTimePassed) {
        // console.log(
        //     '[Kapsula] Стоп: пользователь еще не провел 10 секунд на странице',
        // );
        return;
    }

    let pop = document.querySelector(POPUP_SELECTOR);

    if (!pop) {
        // console.log('[Kapsula] Вставляем popup в DOM');

        document.body.insertAdjacentHTML(
            'beforeend',
            popup,
        );

        pop = document.querySelector(POPUP_SELECTOR);
    } else {
        // console.log(
        //     '[Kapsula] Popup уже существует в DOM, повторно не вставляем',
        // );
    }

    if (!pop) {
        // console.error(
        //     '[Kapsula] Ошибка: popup не найден после вставки',
        // );

        return;
    }

    const headline = pop.querySelector(
        '[data-personalized-hedline]',
    );

    const eridEl = pop.querySelector(
        '[data-personalized-erid]',
    );

    const text = pop.querySelector(
        '[data-personalized-text]',
    );

    const visual = pop.querySelector(
        '[data-personalized-visual]',
    );

    const {
        group,
        country,
    } = content;

    // console.log('[Kapsula] Заполняем popup:', {
    //     headline: group.headline,
    //     text: group.text(country.destination),
    //     destination: country.destination,
    //     image: country.image,
    //     erid: group.erid,
    // });

    headline.textContent = group.headline;

    text.textContent =
        group.text(country.destination);

    visual.style.backgroundImage =
        `url("${country.image}")`;

    eridEl.textContent =
        `ООО «Центрбронь» erid: ${group.erid}`;

    popupShown = true;

    // console.log('[Kapsula] Popup готов к показу');
}

function startRouteTimer() {
    // console.log('[Kapsula] Перезапускаем таймер:', {
    //     currentPath,
    //     delay: SHOW_DELAY,
    // });

    clearTimeout(routeTimer);

    routeTimePassed = false;

    const content = getContent(currentPath);

    if (!content) {
        // console.log(
        //     '[Kapsula] Таймер не запускаем: route не подходит',
        // );

        return;
    }

    routeTimer = setTimeout(() => {
        routeTimePassed = true;

        // console.log(
        //     '[Kapsula] 10 секунд на route прошло',
        //     {
        //         currentPath,
        //     },
        // );

        tryShowPopup();
    }, SHOW_DELAY);
}


// dataLayer
dataLayerWatcher
    .event$('applied_filters')
    .subscribe((data) => {
        // console.log(
        //     '[Kapsula] Получен applied_filters:',
        //     data,
        // );

        isEliteService =
            Array.isArray(data?.item_concept) &&
            data.item_concept.includes('Элит сервис');

        // console.log(
        //     '[Kapsula] Проверка "Элит сервис":',
        //     {
        //         item_concept: data?.item_concept,
        //         isEliteService,
        //     },
        // );

        tryShowPopup();
    });


// начальный route
// console.log('[Kapsula] Инициализация:', {
//     currentPath,
// });

startRouteTimer();


// SPA navigation
CoralRouteBus.subscribe(({path}) => {
    // console.log(
    //     '[Kapsula] CoralRouteBus route change:',
    //     {
    //         previousPath: currentPath,
    //         nextPath: path,
    //     },
    // );

    currentPath = path;

    startRouteTimer();

    tryShowPopup();
});