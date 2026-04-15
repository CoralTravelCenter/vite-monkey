export const aprilQuizData = {
  launcher: {
    label: 'Поможем выбрать отпуск'
  },

  intro: {
    title: 'Не знаете, куда полететь в апреле?',
    text: 'Ответьте на несколько вопросов — и мы подскажем, что подойдет именно вам',
    buttonText: 'Начать',
    image: 'https://b2ccdn.sunmar.ru/content/Quiz_1.jpg'
  },

  resultsTitle: 'Подобрали для вас',
  resultButton: {
    text: 'Смотреть подборку',
    url: '/idei-otdykha/turtsiya-ili-egipet-aprel'
  },
  nextText: 'Продолжить',
  resultsLimit: 1,

  questions: [
    {
      id: 'climate',
      type: 'single',
      title: 'Какой климат вам нравится?',
      image: 'https://b2ccdn.sunmar.ru/content/Quiz_2.jpg',
      options: [
        {
          id: 'dry-hot',
          label: 'Сухой климат, яркое солнце, воздух +32°C и теплое море до +25°C',
          value: 'dry-hot',
          scores: {
            egypt: 6
          }
        },
        {
          id: 'warm-breeze',
          label: 'Тёплая погода +23...25°C, цветущие сады и легкий бриз с моря',
          value: 'warm-breeze',
          scores: {
            turkey: 6
          }
        }
      ]
    },

    {
      id: 'dream-beach',
      type: 'single',
      title: 'Как выглядит пляж вашей мечты?',
      image: 'https://b2ccdn.sunmar.ru/content/Quiz_3.jpg',
      options: [
        {
          id: 'corals-fishes',
          label: 'Красивое море с кораллами и разноцветными рыбками',
          value: 'corals-fishes',
          scores: {
            egypt: 4
          }
        },
        {
          id: 'soft-sand',
          label: 'Мягкий золотой песок, пологий вход в море',
          value: 'soft-sand',
          scores: {
            turkey: 4
          }
        }
      ]
    },

    {
      id: 'activities',
      type: 'multi',
      min: 1,
      title: 'Чем бы вам хотелось заняться на отдыхе?',
      image: 'https://b2ccdn.sunmar.ru/content/Quiz_4.jpg',
      options: [
        {
          id: 'safari',
          label: 'Отправиться в сафари по пустыне',
          value: 'safari',
          scores: {
            egypt: 1
          }
        },
        {
          id: 'antique-cities',
          label: 'Изучить античные города',
          value: 'antique-cities',
          scores: {
            turkey: 1
          }
        },
        {
          id: 'walk-photo',
          label: 'Гулять и фотографировать красивые виды',
          value: 'walk-photo',
          scores: {
            turkey: 1
          }
        },
        {
          id: 'beach',
          label: 'Просто лежать на пляже',
          value: 'beach',
          scores: {
            egypt: 1
          }
        }
      ]
    }
  ],

  results: [
    {
      id: 'egypt',
      title: 'Вам пора в Египет!',
      description: 'Солнце, море и рифы для идеального отдыха в Египте',
      image: 'https://b2ccdn.sunmar.ru/content/Quiz_2.jpg',
      url: '/idei-otdykha/turtsiya-ili-egipet-aprel',
      hash: 'egypt'
    },
    {
      id: 'turkey',
      title: 'Вам пора в Турцию!',
      description: 'Гуляйте по достопримечательностям Турции и наслаждайтесь',
      image: 'https://b2ccdn.sunmar.ru/content/Quiz_4.jpg',
      url: '/idei-otdykha/turtsiya-ili-egipet-aprel',
      hash: 'turkey'
    }
  ]
};
