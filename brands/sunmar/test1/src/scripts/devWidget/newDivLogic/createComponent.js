import {moreElements} from "./moreElements.js";


export function newDiv() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const injectedParent = document.querySelector(".experiment-div");
            if(injectedParent) {
                injectedParent.classList.add("abobchik");
                const finalDiv = moreElements(injectedParent);
                resolve(finalDiv);
            }
            else {
                reject(new Error("Ёмаё промис пал милорд"));
            }
        }, 5000)
    })
}