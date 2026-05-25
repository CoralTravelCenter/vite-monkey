import emailjs from '@emailjs/browser'
import {createLeadExcelAttachment} from './excel.service'

const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'

export function initEmailService() {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
    blockHeadless: true,
    limitRate: {
      id: 'elite-franch-mail-popup',
      throttle: 10000,
    },
  })
}

export function sendLeadEmail(data) {
  const attachment = createLeadExcelAttachment(data)

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email: 'reception@franchcoral.ru',

      excel_file: attachment.content,
      excel_filename: attachment.filename,

      name: data.name || '',
      phone: data.phone || '',
      email: String(data.email || '').trim().toLowerCase(),
    },
  )
}
