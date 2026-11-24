import './style.css'

function observeFilteredElements(selector, searchStrings, onChange, root = document.getElementById('root') || document.body) {
    const processed = new WeakSet();
    const collectedElements = [];

    const queries = Array.isArray(searchStrings)
        ? searchStrings.map(s => s.toLowerCase())
        : [searchStrings.toLowerCase()];

    const matchesText = (el) => {
        const text = (el.textContent || '').toLowerCase();
        return queries.some(query => text.includes(query));
    };

    const markDetails = (el) => {
        // 1. Сначала ищем вверх по дереву (если .location находится внутри .details)
        let detailsEl = el.closest('.details');
        console.log(detailsEl);
        if (detailsEl) {
            detailsEl.setAttribute('data-shild', ''); // Вешаем пустой атрибут <div class="details" ta>
            // Если нужно значение, например ta="true", замените на: detailsEl.setAttribute('ta', 'true');
        }
    };

    const checkAndNotify = () => {
        const currentElements = root.querySelectorAll(selector);
        let hasNew = false;

        currentElements.forEach((el) => {
            if (!processed.has(el) && matchesText(el)) {
                processed.add(el);
                collectedElements.push(el);

                // Сразу ищем .details и вешаем атрибут
                markDetails(el);

                hasNew = true;
            }
        });

        if (hasNew) {
            onChange([...collectedElements]);
        }
    };

    checkAndNotify();

    const observer = new MutationObserver(() => {
        checkAndNotify();
    });

    observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
        characterData: true
    });

    return () => observer.disconnect();
}

// Пример использования:
const stopObserving = observeFilteredElements(
    '.location.has-coordinates',
    ['Анталья', 'Antalya'],
    (elements) => {
        console.log(`Обработано элементов: ${elements.length}`);
    }
);
