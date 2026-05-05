// import markup from './markup.html?raw'
// import './style.css'
//
// document.body.insertAdjacentHTML('beforeend', markup)

async function initOffreVueObserver({selector = '.offre-vue', threshold = 0.3, timeout = 10000} = {}) {
    return new Promise((resolve, reject) => {
        let mutationObserver = null;
        let intersectionObserver = null;
        let timer = null;

        const cleanup = () => {
            mutationObserver?.disconnect();
            intersectionObserver?.disconnect();
            clearTimeout(timer);
        };

        const observeIntersection = (element) => {
            intersectionObserver = new IntersectionObserver((entries, obs) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        cleanup();
                        resolve(entry.target);
                        break;
                    }
                }
            }, {threshold});

            intersectionObserver.observe(element);
        };

        const existingElement = document.querySelector(selector);

        if (existingElement) {
            observeIntersection(existingElement);
        } else {
            mutationObserver = new MutationObserver(() => {
                const element = document.querySelector(selector);

                if (element) {
                    mutationObserver.disconnect();
                    observeIntersection(element);
                }
            });

            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }

        timer = setTimeout(() => {
            cleanup();
            reject(new Error(`Элемент ${selector} не найден или не попал в зону видимости`));
        }, timeout);
    });
}

await initOffreVueObserver();
const popup = document.getElementById('ne-otkladivy-otpusk');
if (popup) popup.show()