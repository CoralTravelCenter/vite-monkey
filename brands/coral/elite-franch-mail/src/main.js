import markup from './markup.html?raw'
import {Model} from 'survey-core'
import 'survey-js-ui'
import './style.scss'
import 'survey-core/survey-core.min.css'

import {surveyJson} from './survey.config'
import {initEmailService, sendLeadEmail} from './email.service'

await customElements.whenDefined('coral-popup')

if (!document.getElementById('elite-franch-mail-popup')) {
  document.body.insertAdjacentHTML('beforeend', markup)
}

const TARGET = document.getElementById('elite-franch-mail-popup')
const TRIGGER = document.getElementById('elite-franch-mail-popup-trigger')
const FORM_CONTAINER = document.getElementById('lead-form')

if (!TARGET || !TRIGGER || !FORM_CONTAINER) {
  throw new Error('Не найдены элементы формы: popup, trigger или lead-form')
}

initEmailService()

const survey = new Model(surveyJson)

survey.getAllQuestions().forEach((question) => {
  if (question.isRequired) {
    question.requiredErrorText = 'Заполните поле'
  }
})
survey.onCompleting.add(async (sender, options) => {
  options.allow = false

  try {
    await sendLeadEmail(sender.data)

    options.allow = true
  } catch (error) {
    console.error('EmailJS send error:', error)
    options.message = 'Не удалось отправить заявку. Попробуйте позже.'
  }
})

survey.render(FORM_CONTAINER)

TRIGGER.addEventListener('click', () => {
  TARGET.show()
})
