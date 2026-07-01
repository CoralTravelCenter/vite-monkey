import './style.css';
// import markup from './markup.html?raw'
// import bubble from './buble.html?raw'

await customElements.whenDefined('sunmar-popup')
await customElements.whenDefined('sunmar-bubble')
// document.body.insertAdjacentHTML('beforeend', markup)
// document.querySelector('div[class*="HeaderTopBar_leftPart"]').insertAdjacentHTML('afterbegin', bubble)

const popup = document.getElementById('promo_page_sunmar');
if (popup) {
  document.body.append(popup)
}
// const trigger = document.getElementById('promo-trigger-sunmar');
// if (trigger) {
//   document.querySelector('div[class*="HeaderMobile_rightGroup"]').append(trigger)
//   trigger.addEventListener('click', () => {
//     popup.show()
//   })
// }
