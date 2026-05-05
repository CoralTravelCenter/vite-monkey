import markup from './markup.html?raw';
import './style.css';


// Desktop

// const insertIn = document.querySelector('.menu').parentElement;
// console.log(insertIn);


// function insertHtmlOnce(placeToInsert, element, markup) {
//     const parent = element.parentElement;
//     if (parent.hasAttribute('data-insert')) return;
//     element.insertAdjacentHTML(placeToInsert, markup);
//     parent.setAttribute('data-insert', true);
// }

// insertHtmlOnce('beforeend', insertIn, markup)


// Mobile
    const insertIn = document.querySelector('.social-media-links').closest('section');
    function insertHtmlOnce(placeToInsert, element, markup) {
        const parent = element.parentElement;
        if (parent.hasAttribute('data-insert')) return;
        element.insertAdjacentHTML(placeToInsert, markup);
        parent.setAttribute('data-insert', true);
    }
    insertHtmlOnce('beforebegin', insertIn, markup)


