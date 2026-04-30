export function arrayOfNodesWith(what) {
    var nodes;
    if (what.jquery) {
        nodes = what.toArray();
    } else if (what instanceof Array) {
        nodes = what.map(item => arrayOfNodesWith(item)).flat(Infinity);
    } else if (what instanceof Node) {
        nodes = [what];
    } else if (what instanceof NodeList || what instanceof HTMLCollection) {
        nodes = Array.from(what);
    } else if (typeof what === 'string') {
        nodes = Array.from(document.querySelectorAll(what));
    } else {
        throw "*** arrayOfNodesWith: Got something unusable as 'what' param: " + what;
    }
    return nodes;
}
