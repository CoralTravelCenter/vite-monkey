import './style.css'

const placeToInsert = document.querySelector(
  '[class*="HotelListFilters_showMapWrapper__"]'
);

const checkbox = [...document.querySelectorAll('.ant-checkbox-label > span')]
  .find(el => el.textContent.trim() === 'Черная пятница')
  ?.closest('.ant-space-item');

if (placeToInsert && checkbox) {
  checkbox.setAttribute('data-black-friday', '');
  placeToInsert.insertAdjacentElement('afterend', checkbox);
}
