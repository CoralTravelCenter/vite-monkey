// Категории 4 и 5 звезд
import {ReactDomObserver} from "../../utils.js";

const selector = 'div[class*="Collapse_collapseContainer__"]';

const FILTERS_MAP = {
  hotelAvailability: 'Доступность отеля',
  region: 'Регион',
  hotelNameSearch: 'Поиск по названию отеля',
  hotelCategory: 'Категория отеля',
  mealType: 'Тип питания',
  hotelConcept: 'Концепция отеля',
  price: 'Цена',
  specialOffers: 'Акции и спецпредложения',
  recommendedHotels: 'Рекомендуемые отели',
  hotelInfo: 'Информация об отеле',
  totalArea: 'Общая площадь',
  distanceToBeach: 'Расстояние до пляжа (м)',
  distanceToAirport: 'Расстояние до аэропорта (км)',
  distanceToCityCenter: 'Расстояние до центра города (км)',
  beach: 'Пляж',
  poolsAndWaterpark: 'Бассейны и аквапарк',
  forChildren: 'Для детей',
  hotelServices: 'Услуги отеля',
  roomAmenities: 'Оснащение номера',
  roomType: 'Тип номера',
  additionalOptions: 'Дополнительные опции',
};

const normalizeText = (text = '') => text.replace(/\s+/g, ' ').trim();

const getFilterText = (element) => {
  const headerTextEl = element.querySelector('.ant-collapse-header-text');
  if (headerTextEl) {
    return normalizeText(headerTextEl.textContent);
  }

  const checkboxLabelEl = element.querySelector(
    '[class*="Collapse_nonCollapseBody__"] .ant-checkbox-label'
  );
  if (checkboxLabelEl) {
    return normalizeText(checkboxLabelEl.textContent);
  }

  return '';
};

new ReactDomObserver(selector, {
  onAppear: (host) => {
    const filterLabels = Object.values(FILTERS_MAP);
    const children = Array.from(host.children);

    children.forEach((child) => {
      const childText = getFilterText(child);
      if (!childText) return;

      const label = filterLabels.find((item) => item === childText);
      if (!label) return;

      child.setAttribute('data-filter-name', label);
    });
  }
}).start();
