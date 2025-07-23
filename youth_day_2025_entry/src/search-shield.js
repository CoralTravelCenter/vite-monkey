import {appendOnce, ReactDomObserver} from "../../utils.js";
import './search-shield/shield.css';
import shieldUS from './search-shield/shield.html?raw';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function insertShield(el) {
  let cards = null;
  if (!isMobile) {
    cards = el.querySelectorAll('.hotel-card');
  } else {
    cards = el.querySelectorAll('.hotel-card-price');
  }

  const shield = document.createElement('div');
  shield.id = 'promo-shield'
  shield.innerHTML = shieldUS
  shield.addEventListener('click', () => {
    ym(215233, "reachGoal", "entry_point", {
      name_stock: {
        den_molodezhi: {
          name_point: "search_card"
        }
      }
    })

    window.open('/info-actions/den-molodezhi/?erid=2W5zFJ5fm9r', '_blank');
  })
  cards.forEach(card => appendOnce(card, shield));
}

const observer = new ReactDomObserver('[data-testid="virtuoso-item-list"]', {
  watchAttributes: true,
  attributeFilter: ['style'],
  onAppear: (el) => {
    insertShield(el)
  },
  onAttributeMutation: (el) => {
    insertShield(el)
  }
})
observer.start()

// const observer = new ReactDomObserver('a[href*="search-molodezh"]', {
//   onAppear: (el) => {
//     el.addEventListener("click", (e) => {
//       e.preventDefault()
//       ym(215233, "reachGoal", "entry_point", {
//         name_stock: {
//           den_molodezhi: {
//             name_point: "search",
//           },
//         },
//       });
//       window.open('https://www.sunmar.ru/info-actions/den-molodezhi/?banner_on_site=search-molodezh', '_blank');
//     });
//   }
// })
// observer.start();
