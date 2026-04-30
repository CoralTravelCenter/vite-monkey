import { arrayOfNodesWith } from './nodes.js';

export function watchIntersection(targets, options, yes_handler, no_handler) {
    const io = new IntersectionObserver(function (entries, observer) {
        for (const entry of entries) {
            entry.isIntersecting ? yes_handler?.call(this, entry.target, observer) : no_handler?.call(this, entry.target, observer);
        }
    }, {
        threshold: 1,
        ...options
    });
    for (const node of arrayOfNodesWith(targets)) {
        io.observe(node);
    }
    return io;
}
