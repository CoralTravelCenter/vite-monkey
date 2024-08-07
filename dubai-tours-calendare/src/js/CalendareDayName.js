export class DayName {
  #days = ["ПН", "ВТ", "СР", "ЧВ", "ПТ", " СБ", "ВС"];

  render() {
    return this.#days
      .map((name) => {
        return `<div class="js-month__day-name">
        ${name}
      </div>`;
      })
      .join("");
  }
}
