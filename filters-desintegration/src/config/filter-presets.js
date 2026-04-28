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
    couple: {
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
    solo: {
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
};
