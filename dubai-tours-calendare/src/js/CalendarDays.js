export class CalendarDays {
  constructor(eventDay, monthIndex) {
    this.eventDay = eventDay;
    this.monthIndex = monthIndex;
    this.year = new Date().getFullYear();
    this.daysInMonth = new Date(this.year, this.monthIndex, 0).getDate();
    this.firstDay = new Date(this.year, this.monthIndex, 1).getDay();
    this.previousMonthDays = this.getPreviousMonthDays();
  }

  getPreviousMonthDays() {
    const previousMonthIndex = (this.monthIndex - 1 + 12) % 12;
    const previousMonthDays = new Date(
      this.year,
      previousMonthIndex + 1,
      0,
    ).getDate();
    return previousMonthDays - this.firstDay + 1;
  }

  render() {
    const days = [];
    let day = 1;

    // Добавляем дни предыдущего месяца
    for (let i = 0; i < this.firstDay; i++) {
      days.push(`<span class="day">${this.previousMonthDays + i}</span>`);
    }

    // Добавляем дни месяца
    for (let i = 0; i < this.daysInMonth; i++) {
      if (i === this.eventDay - 1) {
        days.push(`<span class="day active_event">${day}</span>`);
      } else {
        days.push(`<span class="day">${day}</span>`);
      }
      day++;
    }

    return days.join("");
  }
}
