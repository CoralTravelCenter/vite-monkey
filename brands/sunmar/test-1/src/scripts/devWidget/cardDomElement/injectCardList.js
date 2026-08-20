import {injectMainElement} from "./injectMainElement.js";

export function initCardList() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const injectedParent = document.querySelector(".experiment-div");
            if (injectedParent) {
                resolve(injectMainElement(injectedParent));
            }
            else {
                reject(new Error("Ёмаё промис пал милорд"));
            }
        }, 5000);
    })
}