import css from './style.css?raw';

const STYLE_ID = 'vietnam-specific-styles';

function getDestinationValue() {
    const container = document.querySelector('#QSArrivalContainer');

    if (!container) {
        return '';
    }

    // Mobile: выбранное значение записывается в input.value.
    const mobileInput = container.querySelector(
        'input.ant-input:not(.ant-select-input)'
    );

    const mobileValue = mobileInput?.value.trim();

    if (mobileValue) {
        return mobileValue;
    }

    // Desktop: input остаётся пустым, значение выводится текстом.
    const desktopContainer = container.querySelector(
        '.ant-select-content'
    );

    return (
        desktopContainer?.innerText
            .split('\n')
            .map(value => value.trim())
            .find(Boolean) ?? ''
    );
}

function enableStyles() {
    if (document.getElementById(STYLE_ID)) {
        return;
    }

    const styles = document.createElement('style');

    styles.id = STYLE_ID;
    styles.textContent = css;

    document.head.appendChild(styles);

    console.log('Стили для Вьетнама включены');
}

function disableStyles() {
    const styles = document.getElementById(STYLE_ID);

    if (!styles) {
        return;
    }

    styles.remove();

    console.log('Стили для Вьетнама отключены');
}

function updateStyles() {
    const destination = getDestinationValue();

    if (destination === 'Вьетнам') {
        enableStyles();
    } else {
        disableStyles();
    }
}

let updateScheduled = false;

function scheduleUpdate() {
    if (updateScheduled) {
        return;
    }

    updateScheduled = true;

    // Первый кадр позволяет React обработать событие.
    requestAnimationFrame(() => {
        // Второй кадр нужен мобильному модальному окну:
        // после «Готово» основной input обновляется не сразу.
        requestAnimationFrame(() => {
            updateScheduled = false;
            updateStyles();
        });
    });
}

// Делегирование работает и для динамически создаваемого мобильного окна.
// Фоновый интервал не используется.
document.addEventListener('click', scheduleUpdate);

// Проверяем значение, которое могло быть установлено до запуска скрипта.
updateStyles();