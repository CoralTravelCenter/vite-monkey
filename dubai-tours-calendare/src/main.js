import { CalendarDays } from "../src/js/CalendarDays";
import { DayName } from "./js/CalendareDayName";
import { MonthName } from "./js/MonthName";
import "./style.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

document.body.insertAdjacentHTML(
  "beforeend",
  `
  <div data-calendar></div>
`,
);

window.dubai_tours_calendare = {
  June: [
    {
      event: "Event",
      event_description: "Lorem ipsum dolor",
      event_date: "28.06",
    },
    {
      event: "Event-2",
      event_description: "Lorem ipsum dolor",
      event_date: "28.07",
    },
  ],
};

function generateDate(str) {
  return str.replace("0", "").split(".");
}

dubai_tours_calendare.forEach((event) => {
  const [eventDay, monthIndex] = generateDate(event.event_date);
  const calendarDays = new CalendarDays(eventDay, monthIndex).render();
  const dayName = new DayName().render();
  const monthName = new MonthName(monthIndex).render();

  document.querySelector("[data-calendar]").insertAdjacentHTML(
    "beforeend",
    `
    <div class="js-month">
      ${monthName}
      <div class="js-month__dayname-wrapper">
        ${dayName}
      </div>
      <div class="js-month__day-wrapper">
        ${calendarDays}
      </div>
    </div>
  `,
  );
});

const tooltipTarget = document.querySelectorAll(".active_event");
tooltipTarget.forEach((target, idx) => {
  tippy(target, {
    allowHTML: true,
    interactive: true,
    content: `
    <div class="event-tooltip">
      <h2>${dubai_tours_calendare[idx].event}</h2>
      <p>${dubai_tours_calendare[idx].event_description}</p>
    </div>
  `,
    onShow() {
      target.classList.add("tooltip-open");
    },
    onHide() {
      target.classList.remove("tooltip-open");
    },
  });
});
