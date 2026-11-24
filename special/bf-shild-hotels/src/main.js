import markup from './markup.html?raw';
import './style.css'
import {mediaMatcher} from "@utils";

function waitForElement(selector, root = document.getElementById('root') || document.body) {
    return new Promise((resolve) => {
        const existingElement = root.querySelector(selector);
        if (existingElement) {
            return resolve(existingElement);
        }

        const observer = new MutationObserver(() => {
            const targetElement = root.querySelector(selector);
            if (targetElement) {
                observer.disconnect();
                resolve(targetElement);
            }
        });

        observer.observe(root, {
            childList: true,
            subtree: true
        });
    });
}



function insertBlackFridayCard() {
    mediaMatcher(993, async (isDesktop) => {
        try {
            const containerSelector = isDesktop
                ? '[data-testid="hotel-detail-summary-card"]'
                : '.hotelConceptsWrapper'

            console.log(containerSelector);
            const [bfBadge, container] = await Promise.all([
                waitForElement('[alt="Черная пятница"]'),
                waitForElement(containerSelector)
            ]);

            if (bfBadge && container && !document.querySelector('#bf-card')) {
                container.insertAdjacentHTML('afterbegin', markup);
            }
        } catch (error) {
            console.warn('Не удалось дождаться элементов для вставки плашки:', error);
        }
    });
}

insertBlackFridayCard();

