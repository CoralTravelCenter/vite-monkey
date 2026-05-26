import * as XLSX from 'xlsx'

const EXCEL_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

function normalizeValue(value) {
  return value == null ? '' : String(value).trim()
}

export function createLeadExcelAttachment(data) {
  const rows = [
    ['Поле', 'Значение'],
    ['Ваше имя', normalizeValue(data.name)],
    ['Номер телефона', normalizeValue(data.phone)],
    ['E-mail', normalizeValue(data.email).toLowerCase()],
    ['Страна', normalizeValue(data.country)],
    ['Название отеля', normalizeValue(data.hotelName)],
    ['Город вылета', normalizeValue(data.departureCity)],
    ['Желаемая дата вылета', normalizeValue(data.departureDate)],
    ['Количество ночей', normalizeValue(data.nightsCount)],
    ['Количество взрослых и детей', normalizeValue(data.touristsCount)],
    ['Ваши особые пожелания к отелю или отдыху', normalizeValue(data.wishes)],
    ['Страница отправки', window.location.href],
    ['Заголовок страницы', document.title],
    ['Дата отправки', new Date().toLocaleString('ru-RU')],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(rows)
  const workbook = XLSX.utils.book_new()

  worksheet['!cols'] = [
    {wch: 45},
    {wch: 70},
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Заявка')

  const base64 = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'base64',
  })

  return {
    filename: `zayavka-${Date.now()}.xlsx`,
    content: `data:${EXCEL_MIME_TYPE};base64,${base64}`,
  }
}
