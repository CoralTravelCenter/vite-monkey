const DEFAULT_INTERVAL_MS = 200;
const DLEvent = "begin_checkout"

const SEGMENT_IN_DAYS = 21;

function checkBookingDate(departureDateStr, dayDelay = SEGMENT_IN_DAYS) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = departureDateStr.split('-').map(Number);
  const departureDate = new Date(year, month - 1, day);

  const diffMs = departureDate - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= dayDelay;
}


// Ждем пуша в DL
function waitForDLEvent(eventName, intervalMs = 200) {
  return new Promise((resolve) => {
    const checkMatch = (item) => item?.event === eventName;

    const poll = () => {
      const dl = window.dataLayer;
      if (!dl) {
        setTimeout(poll, intervalMs);
        return;
      }

      // Проверяем уже имеющиеся элементы
      const found = dl.find(checkMatch);
      if (found) {
        resolve(found);
        return;
      }

      // Перехват push для будущих
      const originalPush = dl.push.bind(dl);
      dl.push = function (...args) {
        const result = originalPush(...args);
        const match = args.find(checkMatch);
        if (match) {
          dl.push = originalPush; // снимаем перехват
          resolve(match);
        }
        return result;
      };
    };

    poll();
  });
}


// Ждем PopMechanic
function waitForWindowVar(name, intervalMs = DEFAULT_INTERVAL_MS) {
  return new Promise((resolve) => {
    const waiter = () => {
      const val = window[name];
      if (val) {
        resolve(val);
      } else {
        setTimeout(waiter, intervalMs);
      }
    };
    waiter();
  });
}


waitForDLEvent(DLEvent).then((evt) => {
  const rawDate = evt?.ecommerce.items[0].item_dates[0]

  if (!rawDate) {
    console.warn("item_dates is missing in begin_checkout event");
    return;
  }

  window.__isSegment = checkBookingDate(rawDate)
  console.log(window.__isSegment)

  waitForWindowVar("PopMechanic").then(popmechanic => {
    console.log()

    if (!popmechanic) {
      console.warn("PopMechanic is not defined");
      return;
    }
    popmechanic?.update();
  });
});
