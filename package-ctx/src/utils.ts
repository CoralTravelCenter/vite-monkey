import {FilterKey, FILTERS} from "./staticData.js";
import {ArrivalItemBase, DateItem, FilterItem, NextMeta, NightOption} from "./types";
import dayjs from 'dayjs'

dayjs().format()

export function parseNextMeta(): NextMeta {
    const nextData = document.getElementById("__NEXT_DATA__");
    if (!nextData) return {};

    try {
        const parsed = JSON.parse(nextData.textContent ?? "");
        return (parsed?.props?.pageProps?.meta ?? {}) as NextMeta;
    } catch (err) {
        console.error("Ошибка парсинга __NEXT_DATA__:", err);
        return {};
    }
}

export async function fetchJSON<TResponse, TRequest = unknown>(
    url: string,
    data: TRequest,
    method: "POST" | "GET" | "PUT" | "DELETE" = "POST"
): Promise<TResponse> {
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: method === "GET" ? undefined : JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as TResponse;
}


export async function hostReactAppReady(
    selector: string = "#__next > div",
    timeout: number = 200
): Promise<void> {
    return new Promise<void>((resolve) => {
        const checkReady = () => {
            const hostEl = document.querySelector<HTMLElement>(selector);
            if (hostEl?.getBoundingClientRect().height) {
                resolve();
            } else {
                setTimeout(checkReady, timeout);
            }
        };
        checkReady();
    });
}

export function filterArrivalLocation<T extends ArrivalItemBase>(
    serverData: T[],
    data: string[]
): T[] {
    const normalizedNames = data.map((name) => name.trim().toLowerCase());

    return serverData.reduce<T[]>((acc, item) => {
        const normalizedName = item.name.trim().toLowerCase();

        const isMatch =
            (item.type === 7 || item.type === 0) && normalizedNames.includes(normalizedName);

        const alreadyExists = acc.some((hotel) => hotel.id === item.id);

        if (isMatch && !alreadyExists) acc.push(item);

        return acc;
    }, []);
}


export function findDateItem<T extends DateItem>(
    data: T[],
    targetDate: string
): T | undefined {
    return data
        .filter(item => item.flightType !== 1)
        .find(item => item.date === targetDate);
}

export function addDays(days: number): string;
export function addDays(date: string, days?: number): string;
export function addDays(dateOrDays: string | number, days: number = 0): string {
    if (typeof dateOrDays === "number") {
        return dayjs().add(dateOrDays, "day").format("YYYY-MM-DD");
    }
    return dayjs(dateOrDays).add(days, "day").format("YYYY-MM-DD");
}

export function findNightOption<T extends NightOption>(
    nightCount: number | string,
    options: T[]
): T | null {
    return options.find(option => option.value === Number(nightCount)) || null;
}

export function buildFilters(filterStr?: string): FilterItem[] {
    const filters: FilterItem[] = [FILTERS.available];

    if (!filterStr) return filters;

    const keys = filterStr.replace(/\s+/g, "").toLowerCase().split(",");

    for (const key of keys) {
        if (key in FILTERS) {
            filters.push(FILTERS[key as FilterKey]);
        }
    }

    return filters;
}
