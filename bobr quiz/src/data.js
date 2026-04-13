export const aprilQuizData = {
  launcher: {
    label: 'Поможем выбрать отпуск'
  },

  intro: {
    title: 'Не знаете, куда полететь в апреле?',
    text: 'Ответьте на несколько вопросов — и мы подскажем, что подойдет именно вам',
    buttonText: 'Начать',
    image: 'https://web-static.s.mindbox.ru/quizzes-images/DC1F4E2AC36CC85AD3B2268EA734236182B2F6518037BCAB57168C8ED2DA91B1/8319876EFA4899FD5495A27F11351A86A071AD26E361D89637B3E91D15382832.jpg'
  },

  resultsTitle: 'Подобрали для вас',
  restartText: 'Попробовать снова',
  nextText: 'Продолжить',
  resultsLimit: 2,

  questions: [
    {
      id: 'climate',
      type: 'single',
      title: 'Какой климат вам нравится?',
      image: 'https://web-static.s.mindbox.ru/quizzes-images/DC1F4E2AC36CC85AD3B2268EA734236182B2F6518037BCAB57168C8ED2DA91B1/DB3FD396B6A142442BAE76EFD2C8DA5F0EFBF20554C650C9943E0E2F4F37AFE2.jpg',
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
      image: 'https://web-static.s.mindbox.ru/quizzes-images/DC1F4E2AC36CC85AD3B2268EA734236182B2F6518037BCAB57168C8ED2DA91B1/47923B9AB008799810089060FFB36B5E630DB450394C3D150C551DF45467ECEC.jpg',
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
      image: '/images/quiz/question-3.jpg',
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
      image: 'https://b2ccdn.sunmar.ru/content/egypt-prod-visual.jpg',
      url: ''
    },
    {
      id: 'turkey',
      title: 'Вам пора в Турцию!',
      description: 'Гуляйте по достопримечательностям Турции и наслаждайтесь',
      image: 'https://b2ccdn.sunmar.ru/content/turkey-prod-visual.jpg',
      url: ''
    }
  ]
};
