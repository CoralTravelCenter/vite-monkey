import markup from './template.html?raw'
import './style.css'


async function hostReactAppReady(
    selector = "#__next > div",
    timeout = 500,
) {
    return new Promise((resolve) => {
        const waiter = () => {
            const host_el = document.querySelector(selector);
            if (host_el?.getBoundingClientRect().height) {
                resolve();
            } else {
                setTimeout(waiter, timeout);
            }
        };
        waiter();
    });
}


function welcomeToAppInit() {
    "use strict";
    const pathName = location.pathname
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (!/Mobi|Mobile|Tablet|Phone/i.test(userAgent)) return;
    if (pathName === '/' || pathName.includes('add-passenger')) return;

    sessionStorage.setItem('welcomeToAppRun', true);

    function getMobileOS() {
        const userAgent =
            navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            return "android";
        } else if (
            /iPad|iPhone|iPod/.test(userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
        ) {
            return "ios";
        }
        return "other";
    }

    const insertTo = document.querySelector('#header-row')
    insertTo.insertAdjacentHTML("beforebegin", markup);


    const LOCATION = location.pathname;
    const customSection = document.querySelector(
        '.welcome-to-app[data-custom-section="mindbox"]',
    );
    customSection.dataset.location = LOCATION;


    const deviceOS = getMobileOS();
    const actionButton =
        customSection && customSection.querySelector(".welcome-to-app__link");
    actionButton.addEventListener("click", () => {
        ym(96674199, "reachGoal", "install", {
            page: LOCATION
        });
        if (deviceOS === "ios")
            window.open(
                "https://apps.apple.com/ru/app/coral-travel-туроператор/id1497841397",
                "_blank",
            );
        if (deviceOS === "android")
            window.open(
                "https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile",
                "_blank",
            );
    });

    const closeBtn = document?.querySelector('.welcome-to-app__close')
    closeBtn.addEventListener('click', () => {
        customSection.classList.add('js-hide')
    })
}

//
//hostReactAppReady().then(() => {
//    if (!sessionStorage.getItem('welcomeToAppRun')) welcomeToAppInit()
//})

welcomeToAppInit()