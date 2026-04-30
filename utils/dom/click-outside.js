export class ClickOutside {
    /**
     * @param {string} selector                   - селектор элемента
     * @param {(evt: Event) => void} callback     - вызывается при клике вне
     * @param {Object} [options]
     * @param {(HTMLElement|string|((evt: Event)=>boolean))[]} [options.ignore=[]]
     * @param {boolean} [options.capture=true]
     * @param {boolean} [options.once=false]
     */
    constructor(selector, callback, {ignore = [], capture = true, once = false} = {}) {
        if (typeof selector !== 'string') {
            throw new TypeError('ClickOutside: "selector" должен быть строкой');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('ClickOutside: "callback" должен быть функцией');
        }

        this.selector = selector;
        this.element = document.querySelector(selector) || null;
        this.callback = callback;
        this.ignore = ignore;
        this.capture = capture;
        this.once = once;

        this._handler = this._handler.bind(this);
        document.addEventListener('click', this._handler, this.capture);
        this._listening = true;
    }

    /** Обновить селектор (например, если элемент заменили) */
    setSelector(selector) {
        this.selector = selector;
        this.element = document.querySelector(selector) || null;
    }

    /** Снять слушатель */
    destroy() {
        if (!this._listening) return;
        document.removeEventListener('click', this._handler, this.capture);
        this._listening = false;
    }

    _handler(evt) {
        if (!this.element) {
            this.element = document.querySelector(this.selector) || null;
            if (!this.element) return; // элемента ещё нет в DOM
        }

        if (!this._isOutside(evt)) return;

        this.callback(evt);
        if (this.once) this.destroy();
    }

    _isOutside(evt) {
        const el = this.element;
        if (!el) return false;

        const path = typeof evt.composedPath === 'function' ? evt.composedPath() : this._buildPath(evt);
        if (path.includes(el) || el.contains(evt.target)) return false;

        for (const ig of this.ignore) {
            if (typeof ig === 'function' && ig(evt)) return false;
            if (typeof ig === 'string' && evt.target?.closest?.(ig)) return false;
            if (ig instanceof HTMLElement && (path.includes(ig) || ig.contains(evt.target))) return false;
        }
        return true;
    }

    _buildPath(evt) {
        const path = [];
        let node = evt.target;
        while (node) {
            path.push(node);
            node = node.parentNode || node.host || null;
        }
        path.push(window);
        return path;
    }
}


/**
 * Ждём первое появление объекта с нужным event в dataLayer.
 * @param {string} eventName - например, "begin_checkout"
 * @param {number} intervalMs - период опроса (по умолчанию 200 мс)
 * @param timeoutMs
 * @param useLastIfExists
 * @returns {Promise<object>} - найденный объект (глубокая копия)
 */
