import markup from './markup.html?raw';
import './style.css'
// import {watchHotelsTab} from "./watchHotelsTab.js";


// let nodes = [];
// let version = 0;
// let isSearchPage = location.pathname.startsWith('/onlyhotel/');
//
// function removeBadge() {
//   ++version;
//
//   nodes.forEach((node) => node.remove());
//   nodes = [];
// }
//
// watchHotelsTab(async (active) => {
//   removeBadge();
//
//   if (!active || isSearchPage) return;
//
//   try {
//     await customElements.whenDefined('coral-aside');
//
//     if (version !== version || isSearchPage) return;
//
//     const template = document.createElement('template');
//     template.innerHTML = markup;
//
//     nodes = [...template.content.childNodes];
//     document.body.append(template.content);
//   } catch (error) {
//     console.error(error);
//   }
// });
//
// CoralRouteBus.subscribe(({path}) => {
//   isSearchPage = path.startsWith('/onlyhotel/');
//
//   if (isSearchPage) {
//     removeBadge();
//   }
// });

// let nodes = [];
// let version = 0;
// let isSearchPage = location.pathname.startsWith('/onlyhotel/');
//
// function removeBadge() {
//   ++version;
//
//   nodes.forEach((node) => node.remove());
//   nodes = [];
// }
//
// watchHotelsTab(async (active) => {
//   removeBadge();
//
//   if (!active || isSearchPage) return;
//
//   try {
//     await customElements.whenDefined('coral-popup');
//
//     if (version !== version || isSearchPage) return;
//
//     const template = document.createElement('template');
//     template.innerHTML = markup;
//
//     nodes = [...template.content.childNodes];
//     document.body.append(template.content);
//
//     const btn = document.getElementById('onl-trigger');
//     const popup = document.getElementById('only-h');
//
//     if (btn && popup) {
//       btn.addEventListener('click', () => {
//         popup.show?.();
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });
//
// CoralRouteBus.subscribe(({path}) => {
//   isSearchPage = path.startsWith('/onlyhotel/');
//
//   if (isSearchPage) {
//     removeBadge();
//   }
// });

setTimeout(async () => {
  try {
    await customElements.whenDefined('coral-popup');
    document.body.insertAdjacentHTML('beforeend', markup);
    const btn = document.getElementById('onl-trigger');
    const popup = document.getElementById('only-h');

    if (btn && popup) {
      btn.addEventListener('click', () => {
        popup.show?.();
      });
    }
  } catch (error) {
    console.error(error);
  }
}, 30_000);
