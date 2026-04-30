import { generateRandomId } from '../id.js';

export function appendOnce(target, element, id = generateRandomId()) {
    if (!target || !element) return;

    const currentId = target.getAttribute('data-appended');
    if (currentId === id) return;

    target.appendChild(element);
    target.setAttribute('data-appended', id);
}

export function prependOnce(target, element, id = 'default') {
    if (!target || !element) return;

    const currentId = target.getAttribute('data-prepended');
    if (currentId === id) return;

    target.prepend(element);
    target.setAttribute('data-prepended', id);
}

export function insertOnce(target, position, html, id) {
    if (!target || !position || !html || !id) {
        throw new Error('Не указан один из параметров');
    }

    const insertedRaw = target.getAttribute('data-inserted');
    const inserted = insertedRaw ? insertedRaw.split(',') : [];

    if (inserted.includes(id)) return;

    target.insertAdjacentHTML(position, html);

    inserted.push(id);
    target.setAttribute('data-inserted', inserted.join(','));
}

export function insertAfter(newNode, referenceNode) {
    if (!newNode || !referenceNode) return;
    referenceNode.after(newNode);
}
