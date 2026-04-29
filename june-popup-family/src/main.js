import markup from './markup.html?raw';
import './style.css'

async function checkViewItemListCondition() {
  try {
    const eventData = await waitDataLayerEvent("view_item_list");
    const items = eventData?.ecommerce?.items || [];

    const JUNE_START = "2026-06-01";
    const JUNE_END = "2026-06-30";

    const normalizeDate = (date) => {
      if (!date) return null;

      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
        const [day, month, year] = date.split(".");
        return `${year}-${month}-${day}`;
      }

      return null;
    };

    const toArray = (value) => {
      if (Array.isArray(value)) return value;
      if (value == null) return [];
      return [value];
    };

    const isTurkey = (destination) => {
      return toArray(destination).some((item) => {
        return String(item).trim().toLowerCase() === "турция";
      });
    };

    const isPeriodInsideJune = (period) => {
      if (!Array.isArray(period) || period.length < 2) return false;

      const start = normalizeDate(period[0]);
      const end = normalizeDate(period[1]);

      if (!start || !end) return false;

      return start >= JUNE_START && end <= JUNE_END;
    };

    const isOnlyHotel = (item) => {
      const variant = String(item?.item_variant || "").toLowerCase();

      return ["onlyhotel", "only_hotel", "hotel"].includes(variant);
    };

    return items.some((item) => {
      const destination = item.item_destination || eventData.destination;

      const period = isOnlyHotel(item)
        ? eventData.period_hotel || item.period_hotel || item.item_dates
        : eventData.period_flight || item.period_flight || item.item_dates;

      return (
        !isTurkey(destination) &&
        isPeriodInsideJune(period) &&
        Number(item.item_child_count) !== 0
      );
    });
  } catch (error) {
    console.error(error);
    return false;
  }
}

setTimeout(async () => {
  const canRun = await checkViewItemListCondition();
  if (!canRun) return;
  console.log('Run')
  document.body.insertAdjacentHTML('beforeend', markup)
}, 300);
