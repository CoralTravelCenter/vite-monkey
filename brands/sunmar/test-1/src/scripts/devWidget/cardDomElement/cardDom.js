import {newDivElement} from "../../utils/keys.js";

export function cardDom(parentElement, {card_id, card_text, card_color}) {
    const card = document.createElement("div");
    card.id = card_id;

    card.insertAdjacentHTML("afterbegin", newDivElement);

    const elementCard = card.querySelector(".new-div-element");
    if (elementCard) {
        elementCard.classList.add(card_color);
    }

    const id_card = card.querySelector(".id-element");
    if (id_card) {
        id_card.textContent = card_id;
    }

    const text_card = card.querySelector(".text-element");
    if (text_card) {
        text_card.textContent = card_text;
    }

    parentElement.appendChild(card);
    return card;
}