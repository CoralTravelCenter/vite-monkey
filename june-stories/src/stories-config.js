const now = () => Math.floor(Date.now() / 1000);

window.JUNE_STORIES_CONFIG = {
    triggers: [
        {
            id: "family",
            label: "Семейный отпуск",
            avatar: "https://b2ccdn.coral.ru/content/circle-1.webp",
        },
        {
            id: "couple",
            label: "Отдых вдвоем",
            avatar: "https://b2ccdn.coral.ru/content/circle-2.webp",
        },
        {
            id: "solo",
            label: "Соло-путешествия",
            avatar: "https://b2ccdn.coral.ru/content/circle-3.webp",
        },
    ],
    stories: [
        {
            id: "family",
            photo: "https://b2ccdn.coral.ru/content/avatar-1.webp",
            name: "Ольга",
            time: now(),
            items: [
                {
                    id: "family-1",
                    type: "photo",
                    length: 5,
                    src: "https://b2ccdn.coral.ru/content/str-1.webp",
                    preview: "https://b2ccdn.coral.ru/content/str-1.webp",
                    time: now(),
                    title: "Строить замки, купаться и громко смеяться",
                    subtitle: "Насыщенный отдых для детей и взрослых",
                    link: "/family/",
                    linkText: "Узнать больше",
                },
            ],
        },
        {
            id: "couple",
            photo: "https://b2ccdn.coral.ru/content/avatar-2.webp",
            name: "Елена и Александр",
            time: now(),
            items: [
                {
                    id: "couple-1",
                    type: "photo",
                    length: 5,
                    src: "https://b2ccdn.coral.ru/content/str-2.webp",
                    preview: "https://b2ccdn.coral.ru/content/str-2.webp",
                    time: now(),
                    title: "Быть рядом, смотреть на море и никуда не спешить",
                    subtitle: "Романтичный отдых для двоих",
                    link: "/couple/",
                    linkText: "Узнать больше",
                },
            ],
        },
        {
            id: "solo",
            photo: "https://b2ccdn.coral.ru/content/avatar-3.webp",
            name: "Анна",
            time: now(),
            items: [
                {
                    id: "solo-1",
                    type: "photo",
                    length: 5,
                    src: "https://b2ccdn.coral.ru/content/str-3.webp",
                    preview: "https://b2ccdn.coral.ru/content/str-3.webp",
                    time: now(),
                    title: "Выбрать свой ритм и провести отпуск по-своему",
                    subtitle: "Путешествие для тех, кто любит свободу",
                    textTheme: "light",
                    link: "/solo/",
                    linkText: "Узнать больше",
                },
            ],
        },
    ],
};
