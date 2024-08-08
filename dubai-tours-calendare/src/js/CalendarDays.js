import dayjs from 'dayjs'


export class CalendarDays {
	constructor(month) {
		this.currentDate = dayjs(month);
		this.days = Array.from({length: this.currentDate.daysInMonth()}, (_, index) => index + 1);
		this.numOfDaysInPrevMonth = this.currentDate.subtract(1, 'month').daysInMonth();
		this.firstDayOfCurrentMonth = this.currentDate.startOf('month').day()
		this.prevMonthDays = Array.from({length: this.firstDayOfCurrentMonth}, (_, index) => this.numOfDaysInPrevMonth - index).reverse();
		this.remainingDays = Array.from(
			{length: 6 - this.currentDate.endOf('month').day()},
			(_, index) => index + 1
		)
	}

	render() {
		const pannel = [...this.prevMonthDays, ...this.days, ...this.remainingDays];

		return pannel.map(day => {
			return `
				<span class="day">${day}</span>
			`
		}).join('');
	}
}
