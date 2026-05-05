import {FILTERS_MAP} from './filter-map.js';

export const PRESET_META = [
  {id: 'family', label: 'Семейный'},
  {id: 'couple', label: 'Пара'},
  {id: 'solo', label: 'Соло'},
];

const keepAll = () => ({mode: 'keep-all'});
const allow = (...values) => ({mode: 'allow', values});

export const FILTER_PRESETS = {
  family: {
    order: [
      FILTERS_MAP.hotelNameSearch,
      FILTERS_MAP.price,
      FILTERS_MAP.hotelCategory,
      FILTERS_MAP.mealType,
      FILTERS_MAP.roomType,
      FILTERS_MAP.hotelConcept,
      FILTERS_MAP.distanceToBeach,
      FILTERS_MAP.distanceToAirport,
      FILTERS_MAP.beach,
      FILTERS_MAP.poolsAndWaterpark,
      FILTERS_MAP.forChildren,
      FILTERS_MAP.roomAmenities,
      FILTERS_MAP.hotelServices,
    ],
    filters: {
      [FILTERS_MAP.price]: keepAll(),
      [FILTERS_MAP.hotelCategory]: keepAll(),
      [FILTERS_MAP.mealType]: keepAll(),
      [FILTERS_MAP.roomType]: keepAll(),
      [FILTERS_MAP.hotelConcept]: allow('Семейный отдых', 'Coral Family Club'),
      [FILTERS_MAP.distanceToBeach]: keepAll(),
      [FILTERS_MAP.distanceToAirport]: keepAll(),
      [FILTERS_MAP.beach]: allow('Галечный', 'Песчаный'),
      [FILTERS_MAP.hotelServices]: allow('Прачечная', 'Услуги доктора'),
      [FILTERS_MAP.poolsAndWaterpark]: allow('для детей'),
      [FILTERS_MAP.forChildren]: keepAll(),
      [FILTERS_MAP.roomAmenities]: allow('Дополнительная кровать'),
    },
  },
  couple: {
    order: [
      FILTERS_MAP.price,
      FILTERS_MAP.hotelCategory,
      FILTERS_MAP.mealType,
      FILTERS_MAP.roomType,
      FILTERS_MAP.hotelConcept,
      FILTERS_MAP.distanceToBeach,
      FILTERS_MAP.distanceToCityCenter,
      FILTERS_MAP.beach,
      FILTERS_MAP.poolsAndWaterpark,
      FILTERS_MAP.hotelServices,
      FILTERS_MAP.roomAmenities,
    ],
    filters: {
      [FILTERS_MAP.price]: keepAll(),
      [FILTERS_MAP.hotelCategory]: keepAll(),
      [FILTERS_MAP.mealType]: keepAll(),
      [FILTERS_MAP.roomType]: keepAll(),
      [FILTERS_MAP.hotelConcept]: allow(
        'Отели только для взрослых',
        'СПА-отели',
        'Элит сервис'
      ),
      [FILTERS_MAP.distanceToBeach]: keepAll(),
      [FILTERS_MAP.distanceToCityCenter]: keepAll(),
      [FILTERS_MAP.beach]: keepAll(),
      [FILTERS_MAP.poolsAndWaterpark]: allow(
        'Бассейн для взрослых',
        'Подогреваемый бассейн',
        'Крытый бассейн'
      ),
      [FILTERS_MAP.hotelServices]: allow(
        'СПА',
        'Массаж',
        'Хаммам',
        'Сауна',
        'Джакузи',
        'Солярий'
      ),
      [FILTERS_MAP.roomAmenities]: allow('Балкон или терасса'),
    },
  },
  solo: {
    order: [
      FILTERS_MAP.price,
      FILTERS_MAP.hotelCategory,
      FILTERS_MAP.mealType,
      FILTERS_MAP.roomType,
      FILTERS_MAP.hotelConcept,
      FILTERS_MAP.specialOffers,
      FILTERS_MAP.distanceToCityCenter,
      FILTERS_MAP.hotelServices,
    ],
    filters: {
      [FILTERS_MAP.price]: keepAll(),
      [FILTERS_MAP.hotelCategory]: keepAll(),
      [FILTERS_MAP.mealType]: keepAll(),
      [FILTERS_MAP.roomType]: allow('STANDART ROOM'),
      [FILTERS_MAP.hotelConcept]: allow(
        'Рекомендуемые отели',
        'Стамбул - приоритетные отели',
        'ТОП Популярные отели'
      ),
      [FILTERS_MAP.specialOffers]: keepAll(),
      [FILTERS_MAP.distanceToAirport]: keepAll(),
      [FILTERS_MAP.distanceToCityCenter]: keepAll(),
      [FILTERS_MAP.hotelServices]: allow('Сейф на ресепшен'),
    },
  },
};
