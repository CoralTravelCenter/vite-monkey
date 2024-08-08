import dayjs from 'dayjs'
import 'dayjs/locale/ru.js'

dayjs.locale('ru')

export class MonthName {
	constructor(month) {
		this.monthIdx = dayjs(month).month();
		this.monthName = dayjs().month(this.monthIdx).format('MMMM');
	}

	render() {
		return `<div class="js-month__name">${this.monthName}</div>`;
	}
}
