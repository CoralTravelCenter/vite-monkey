const SEGMENT_COOKIE_NAME = 'june_26_segment';

const SEGMENTS = {
    FAMILY: 'family',
    COUPLE: 'couple',
    SOLO: 'solo',
};

const JUNE_START = '2026-06-01';
const JUNE_END = '2026-06-30';

const TURKEY_NAMES = [
    'турция',
    'turkey',
    'türkiye',
];

const normalizeString = (value) => {
    return String(value || '').trim().toLowerCase();
};

const normalizeArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return [];
    return [value];
};

const normalizeDateToIso = (value) => {
    if (!value) return null;

    const date = String(value).trim();

    // 2026-06-01
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }

    // 01.06.2026
    const ddmmyyyy = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

    if (ddmmyyyy) {
        const [, day, month, year] = ddmmyyyy;
        return `${year}-${month}-${day}`;
    }

    return null;
};

const isTurkey = (value) => {
    const normalizedValue = normalizeString(value);

    return TURKEY_NAMES.some((turkeyName) => {
        return normalizedValue.includes(turkeyName);
    });
};

const isTurkeyDestination = (item) => {
    const destinations = [
        ...normalizeArray(item?.item_destination),
        ...normalizeArray(item?.destination),
        item?.item_brand,
    ];

    return destinations.some(isTurkey);
};

const getDateRangeByVariant = (item) => {
    const variant = normalizeString(item?.item_variant);

    const isTour = variant === 'tour';

    const isOnlyHotel =
        variant === 'hotel' ||
        variant === 'only_hotel' ||
        variant === 'onlyhotel';

    if (isTour) {
        if (Array.isArray(item?.period_flight)) {
            return item.period_flight;
        }

        if (item?.['period_flight.0'] || item?.['period_flight.1']) {
            return [
                item['period_flight.0'],
                item['period_flight.1'],
            ];
        }
    }

    if (isOnlyHotel) {
        if (Array.isArray(item?.period_hotel)) {
            return item.period_hotel;
        }

        if (item?.['period_hotel.0'] || item?.['period_hotel.1']) {
            return [
                item['period_hotel.0'],
                item['period_hotel.1'],
            ];
        }
    }

    // fallback под текущий формат из dataLayer:
    // item_dates: ['2026-06-01', '2026-06-08']
    if (Array.isArray(item?.item_dates)) {
        return item.item_dates;
    }

    return [];
};

const isDateRangeInsideJune2026 = (dateRange) => {
    const [rawStartDate, rawEndDate] = dateRange;

    const startDate = normalizeDateToIso(rawStartDate);
    const endDate = normalizeDateToIso(rawEndDate);

    if (!startDate || !endDate) return false;

    return startDate >= JUNE_START && endDate <= JUNE_END;
};

const getItemsFromViewItemList = (eventData) => {
    return eventData?.ecommerce?.items || [];
};

const getTouristsSegment = (item) => {
    const adultCount = Number(item?.item_adult_count || 0);
    const childCount = Number(item?.item_child_count || 0);

    if (childCount !== 0) {
        return SEGMENTS.FAMILY;
    }

    if (childCount === 0 && adultCount === 2) {
        return SEGMENTS.COUPLE;
    }

    if (childCount === 0 && adultCount === 1) {
        return SEGMENTS.SOLO;
    }

    return null;
};


export const getJunePopupSegmentFromViewItemList = (eventData) => {
    const currentSegment = Cookies.get(SEGMENT_COOKIE_NAME);

    if (currentSegment) {
        return {
            shouldShow: false,
            segment: null,
            reason: 'user_already_in_segment',
            currentSegment,
            item: null,
        };
    }

    const items = getItemsFromViewItemList(eventData);

    if (!items.length) {
        return {
            shouldShow: false,
            segment: null,
            reason: 'empty_items',
            currentSegment: null,
            item: null,
        };
    }

    const matchedItem = items.find((item) => {
        if (isTurkeyDestination(item)) return false;

        const dateRange = getDateRangeByVariant(item);
        if (!isDateRangeInsideJune2026(dateRange)) return false;

        const touristsSegment = getTouristsSegment(item);
        if (!touristsSegment) return false;

        return true;
    });

    if (!matchedItem) {
        return {
            shouldShow: false,
            segment: null,
            reason: 'conditions_not_matched',
            currentSegment: null,
            item: null,
        };
    }

    return {
        shouldShow: true,
        segment: getTouristsSegment(matchedItem),
        reason: 'matched',
        currentSegment: null,
        item: matchedItem,
    };
};