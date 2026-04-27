const now = () => Math.floor(Date.now() / 1000);

window.JUNE_STORIES_CONFIG = {
  triggers: [
    {
      id: "family",
      label: "Семьей",
      avatar: "https://b2ccdn.coral.ru/content/circle-1.webp",
    },
    {
      id: "couple",
      label: "Парой",
      avatar: "https://b2ccdn.coral.ru/content/circle-2.webp",
    },
    {
      id: "solo",
      label: "Соло",
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
          type: "vimeo",
          vimeoId: "1186154866",
          length: 8,
          src: "https://b2ccdn.coral.ru/content/str-1.webp",
          preview: "https://b2ccdn.coral.ru/content/str-1.webp",
          time: now(),
          title: "Строить замки, купаться и\u00A0громко смеяться",
          subtitle: "Насыщенный отдых для детей и\u00A0взрослых",
          link: "/poleznaya-informatsiya/offers/hot-offers/turkey-june/?utm_term=family",
          linkText: "Узнать больше",
          onclick: `ym(96674199, "reachGoal", "entry-point", {
    name_stock: {
      june_26: {
        name_point: "stories_family"
      }
    }
  });`,
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
          type: "vimeo",
          vimeoId: "1186154899",
          length: 8,
          src: "https://b2ccdn.coral.ru/content/str-2.webp",
          preview: "https://b2ccdn.coral.ru/content/str-2.webp",
          time: now(),
          title: "Танцевать, расслабляться, сильнее влюбляться",
          subtitle: "Отдых, который создан для романтики",
          link: "/poleznaya-informatsiya/offers/hot-offers/turkey-june/?utm_term=couple",
          linkText: "Узнать больше",
          onclick: `ym(96674199, "reachGoal", "entry-point", {
    name_stock: {
      june_26: {
        name_point: "stories_romantic"
      }
    }
  });`,
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
          type: "vimeo",
          vimeoId: "1186154877",
          length: 8,
          src: "https://b2ccdn.coral.ru/content/str-3.webp",
          preview: "https://b2ccdn.coral.ru/content/str-3.webp",
          time: now(),
          title: "В\u00A0теплое море нырять, исследовать и\u00A0отдыхать",
          subtitle: "Комфортные соло-путешествия без доплат",
          textTheme: "light",
          link: "/poleznaya-informatsiya/offers/hot-offers/turkey-june/?utm_term=solo",
          linkText: "Узнать больше",
          onclick: `ym(96674199, "reachGoal", "entry-point", {
    name_stock: {
      june_26: {
        name_point: "stories_solo"
      }
    }
  });`,
        },
      ],
    },
  ],
};
