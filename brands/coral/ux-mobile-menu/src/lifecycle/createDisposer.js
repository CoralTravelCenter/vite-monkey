export function createDisposer() {
    const fns = new Set();

    return {
        add(fn) {
            if (typeof fn === "function") fns.add(fn);
        },
        dispose() {
            for (const fn of Array.from(fns).reverse()) {
                try {
                    fn();
                } catch {
                }
            }
            fns.clear();
        },
    };
}
