import { initInjector } from './scripts/initInjector.js';
import { initSwapAnimation } from './scripts/initSwapAnimations.js';
import './style.css';

async function startSwapButton() {
    if (typeof hostReactAppReady !== 'function') {
        console.error(`Приложение не обнаружено!`);
        return;
    }

    try {
        await hostReactAppReady();
    } catch (error) {
        console.error(`Ошибка приложения: ${error}`);
        return;
    }

    initInjector();
    initSwapAnimation();
}

(async function starting() {
    await startSwapButton();
})();