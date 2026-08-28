import {waitForElement} from "@utils";

export async function injectMetric(){
    const selector = '.hero.hello-bar .contenu > a';
    const metric = "if(typeof window.ym === 'function'){ym(215233, 'reachGoal', 'entry_point', {name_stock: {NY_26_27: {name_point: 'banner',},},});}";
    try {
        const container = await waitForElement(selector);
        if (container) {
            container.setAttribute("onclick", metric);
        }
    }
    catch(error) {
        throw new Error("Элемент не найден: ", {
            cause: error,
        });
    }
}