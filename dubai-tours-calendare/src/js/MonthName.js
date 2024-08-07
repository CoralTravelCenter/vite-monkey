export class MonthName {
  #months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  constructor(monthIndex) {
    this.monthIndex = monthIndex;
  }

  render() {
    return `<div class="js-month__name">${this.#months[this.monthIndex - 1]}</div>`;
  }
}
