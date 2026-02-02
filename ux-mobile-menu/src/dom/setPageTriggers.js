function getPageKeyFromPath(pathname) {
    if (pathname.includes("booking/add-passenger")) return "add-passenger";
    if (pathname.includes("hotels")) return "hotels";
    return null;
}

export function createPageTriggers() {
    const apply = (key) => {
        document.body.removeAttribute("data-page");
        if (key) document.body.setAttribute("data-page", key);
    };

    const applyFromLocation = () => {
        apply(getPageKeyFromPath(location.pathname));
    };

    return {apply, applyFromLocation};
}
