export async function asap(cb) {
    if (['complete', 'interactive'].includes(document.readyState)) {
        cb?.();
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', () => {
            cb?.();
            resolve();
        }, { once: true });
    });
}

export function debounce(callee, timeoutMs = 0) {
    let timer = null;

    return function perform(...args) {
        const context = this;
        clearTimeout(timer);

        timer = setTimeout(() => {
            callee.apply(context, args);
        }, timeoutMs);
    };
}

export async function hostReactAppReady(selector = '#__next > div', timeout = 300) {
    return new Promise((resolve) => {
        const waiter = () => {
            const hostEl = document.querySelector(selector);

            if (hostEl?.getBoundingClientRect().height) {
                resolve(hostEl);
            } else {
                setTimeout(waiter, timeout);
            }
        };

        waiter();
    });
}

export async function waitSelector(selector, timeout = 200) {
    return new Promise((resolve) => {
        const waiter = () => {
            const el = document.querySelector(selector);

            if (el) {
                resolve(el);
            } else {
                setTimeout(waiter, timeout);
            }
        };

        waiter();
    });
}

// Backward compatibility with old typo in utils.js
export const waiteSelector = waitSelector;

export async function waitForLibrary(getterFn, timeout = 200) {
    return new Promise((resolve) => {
        const waiter = () => {
            const result = getterFn();

            if (result) {
                resolve(result);
            } else {
                setTimeout(waiter, timeout);
            }
        };

        waiter();
    });
}

export function waitForWindowVar(name, intervalMs = 300) {
    return new Promise((resolve) => {
        const check = () => {
            const val = window[name];

            if (val) {
                resolve(val);
            } else {
                setTimeout(check, intervalMs);
            }
        };

        check();
    });
}
