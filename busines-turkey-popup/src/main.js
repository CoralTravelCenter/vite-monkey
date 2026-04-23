import markup from "./markup.html?raw";

console.log(markup);
document.body.insertAdjacentHTML('beforeend', markup)
