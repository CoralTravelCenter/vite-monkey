import markup from './markup.html?raw';
import './style.css';

const quickSearch = document.querySelector('#quick-search-tab-area');

if (quickSearch) {
    quickSearch.insertAdjacentHTML('afterend', markup);
}

const eventDate = new Date('2026-09-01T23:59:00');

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const elements = {
    days: document.getElementById('days'),
    textDays: document.getElementById('text-days'),
    hours: document.getElementById('hours'),
    textHours: document.getElementById('text-hours'),
    minutes: document.getElementById('minutes'),
    textMinutes: document.getElementById('text-minutes'),
    seconds: document.getElementById('seconds'),
    textSeconds: document.getElementById('text-seconds'),
};

let countdownInterval = null;

function calculateTimeLeft() {
    const now = new Date();
    const timeLeft = eventDate.getTime() - now.getTime();

    if (timeLeft <= 0) {
        return null;
    }

    const days = Math.floor(timeLeft / DAY);
    const hours = Math.floor((timeLeft % DAY) / HOUR);
    const minutes = Math.floor((timeLeft % HOUR) / MINUTE);
    const seconds = Math.floor((timeLeft % MINUTE) / SECOND);

    return {
        days,
        hours,
        minutes,
        seconds,
    };
}

function getDeclension(number, singular, few, plural) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return plural;
    }

    if (lastDigit === 1) {
        return singular;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
    }

    return plural;
}

function setCountdownToZero() {
    if (elements.days) {
        elements.days.textContent = '00';
    }

    if (elements.textDays) {
        elements.textDays.textContent = 'дней';
    }

    if (elements.hours) {
        elements.hours.textContent = '00';
    }

    if (elements.textHours) {
        elements.textHours.textContent = 'часов';
    }

    if (elements.minutes) {
        elements.minutes.textContent = '00';
    }

    if (elements.textMinutes) {
        elements.textMinutes.textContent = 'мин';
    }

    if (elements.seconds) {
        elements.seconds.textContent = '00';
    }

    if (elements.textSeconds) {
        elements.textSeconds.textContent = 'сек';
    }
}

function updateCountdown() {
    const timeLeft = calculateTimeLeft();

    if (!timeLeft) {
        setCountdownToZero();

        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        return false;
    }

    if (elements.days) {
        elements.days.textContent = timeLeft.days
            .toString()
            .padStart(2, '0');
    }

    if (elements.hours) {
        elements.hours.textContent = timeLeft.hours
            .toString()
            .padStart(2, '0');
    }

    if (elements.minutes) {
        elements.minutes.textContent = timeLeft.minutes
            .toString()
            .padStart(2, '0');
    }

    if (elements.seconds) {
        elements.seconds.textContent = timeLeft.seconds
            .toString()
            .padStart(2, '0');
    }

    if (elements.textDays) {
        elements.textDays.textContent = getDeclension(
            timeLeft.days,
            'день',
            'дня',
            'дней',
        );
    }

    if (elements.textHours) {
        elements.textHours.textContent = getDeclension(
            timeLeft.hours,
            'час',
            'часа',
            'часов',
        );
    }

    if (elements.textMinutes) {
        elements.textMinutes.textContent = 'мин';
    }

    if (elements.textSeconds) {
        elements.textSeconds.textContent = 'сек';
    }

    return true;
}

const shouldStartCountdown = updateCountdown();

if (shouldStartCountdown) {
    countdownInterval = setInterval(updateCountdown, SECOND);
}