export const surveyJson = {
  showQuestionNumbers: 'off',
  checkErrorsMode: 'onValueChanged',
  textUpdateMode: 'onTyping',
  completeText: 'Отправить',
  completedHtml: `
    <div class="elite-franch-mail-popup__success">
      Спасибо! Заявка отправлена.
    </div>
  `,
  pages: [
    {
      name: 'leadForm',
      elements: [
        {
          type: 'text',
          name: 'name',
          title: 'Ваше имя',
          isRequired: true,
          maxLength: 80,
          placeholder: 'Иванов Иван Иванович'
        },
        {
          type: 'text',
          name: 'phone',
          title: 'Номер телефона',
          isRequired: true,
          placeholder: '+7 (___) ___-__-__',
          maskType: 'pattern',
          maskSettings: {
            pattern: '+7 (999) 999-99-99',
            saveMaskedValue: true,
          },
        },
        {
          type: 'text',
          name: 'email',
          title: 'E-mail',
          isRequired: true,
          inputType: 'email',
          placeholder: 'example@mail.ru',
          maxLength: 120,
          validators: [
            {
              type: 'email',
              text: 'Введите корректный e-mail',
            },
            {
              type: 'regex',
              regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$',
              text: 'Введите e-mail в формате name@example.com',
            },
          ],
        },
        {
          type: 'text',
          name: 'country',
          title: 'Страна',
          isRequired: true,
          maxLength: 80,
          placeholder: 'Турция'
        },
        {
          type: 'text',
          name: 'hotelName',
          title: 'Название отеля',
          isRequired: true,
          maxLength: 150,
        },
        {
          type: 'text',
          name: 'departureCity',
          title: 'Город вылета',
          isRequired: true,
          maxLength: 80,
        },
        {
          type: 'text',
          name: 'departureDate',
          title: 'Желаемая дата вылета',
          isRequired: true,
          inputType: 'date',
        },
        {
          type: 'text',
          name: 'nightsCount',
          title: 'Количество ночей',
          isRequired: true,
          inputType: 'number',
          validators: [
            {
              type: 'numeric',
              minValue: 1,
              maxValue: 60,
              text: 'Укажите количество ночей от 1 до 60',
            },
          ],
        },
        {
          type: 'text',
          name: 'touristsCount',
          title: 'Количество взрослых и детей',
          isRequired: true,
          maxLength: 100,
          placeholder: 'Например: 2 взрослых, 1 ребёнок',
        },
        {
          type: 'comment',
          name: 'wishes',
          title: 'Ваши особые пожелания к отелю или отдыху',
          maxLength: 1000,
        }
      ],
    },
  ],
}
