export function sendMetrica(wrapperElement) {
    const buttonBanner = wrapperElement.querySelector("#banner-button-metric");

    if (!buttonBanner) { return; }

    buttonBanner.addEventListener("click", event => {
        if(typeof ym === 'function') {
            ym(215233, "reachGoal", " entry_point", {
                name_stock: {
                    eb_winter_27: {
                        name_point: "banners",
                    },
                },
            });
        }
    });
}