interface ParentLocation {
    id: string;
    type: number;
    name: string;
    countryId: string;
}

export interface DepartureLocation {
    id: string;
    type: number;
    name: string;
    friendlyUrl: string;
    tourId?: number;
    transportPointId?: number;
    parent?: ParentLocation;
    children?: string[];
}

export interface ArrivalLocationPayload {
    text: string;
    departureLocations: DepartureLocation[];
    locationTypes: number[];
}

export interface FilterValue {
    id: string;
    value: string;
    parent?: string | null;
    providers?: unknown[] | null;
}

export interface FilterItem {
    type: number;
    values: FilterValue[];
    providers: unknown[] | null;
    parent?: FilterValue[];
}

export interface NextMeta {
    [key: string]: unknown;
}

export interface ArrivalItemBase {
    id: string | number;
    name: string;
    type: number;
}

export interface DateItem {
    flightType: number;
    date: string;

    [key: string]: unknown;
}


export interface NightOption {
    value: number;

    [key: string]: unknown; // Доп. поля, если есть
}


export interface GoToPackagesParams {
    domain: string;
    destinationCode: string;
    nights: string;
    depthDays: string;
    regions: string;
    filter: string;
    departureCode: string;
    parsedNEXT: unknown;
}
