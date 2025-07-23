import {doRequestToServer, filterUniqueMatchingHotels, getNextData} from "../../utils.js";
import {HOTELS_OBJ, PACKAGE_ENDPOINTS} from "./constants.js";

const departureId = getNextData().props.pageProps.departure;

function mapHotelLocation(item) {
  return {
    id: item.id,
    type: item.type,
    name: item.name,
    friendlyUrl: item.friendlyUrl
  };
}

async function fetchOnlyHotelLocations(hotels) {
  if (!hotels.length) {
    throw new Error("Hotel names array cannot be empty");
  }

  const responses = await Promise.all(
    hotels.map(hotel =>
      doRequestToServer(
        PACKAGE_ENDPOINTS.LIST_ARRIVAL_LOCATIONS,
        {
          text: hotel.name,
          departureLocations: [
            {
              id: departureId,
              type: 0,
            }
          ]
        }
      )
    )
  );

  const hotelNames = hotels.map(h => h.name);
  const uniqueLocations = filterUniqueMatchingHotels(responses, hotelNames);
  return uniqueLocations.map(mapHotelLocation);
}

async function fetchOnlyHotelPriceSearchEncrypt(locations, dates, nights) {
  if (!locations.length) {
    throw new Error("Locations array cannot be empty");
  }

  if (!dates.length) {
    throw new Error("Dates array cannot be empty");
  }

  const payload = {
    additionalFilters: [],
    arrivalLocations: locations,
    beginDates: [dates],
    imageSizes: [0],
    nights: [{value: nights}],
    paging: {
      pageNumber: 1,
      pageSize: 20,
      sortType: 0,
    },
    reservationType: 1,
    datePickerMode: 0,
    departureLocations: [
      {
        id: departureId,
      }
    ],
    roomCriterias: [
      {
        passengers: [
          {age: 20, passengerType: 0},
          {age: 20, passengerType: 0},
        ],
      },
    ],
    flightType: 2
  };


  return await doRequestToServer(PACKAGE_ENDPOINTS.PRICE_SEARCH_LIST, payload, "POST");
}

const action = document.createElement("button");
action.textContent = "Fetch All Hotels & Prices";
action.style = "padding: 8px 16px; margin: 20px; font-size: 16px;";

action.addEventListener("click", async () => {
  try {
    // 1. Сначала получим arrival locations для всех отелей
    const locations = await fetchOnlyHotelLocations(HOTELS_OBJ);

    console.log("Fetched Locations:", locations);

    if (!locations.length) {
      console.warn("No arrival locations found for requested hotels.");
      return;
    }

    // 2. Теперь для каждой пары (hotel, date) сделаем отдельный запрос
    const allRequests = [];

    for (const hotel of HOTELS_OBJ) {
      const nights = hotel.nights;

      for (const date of hotel.dates) {
        allRequests.push(
          fetchOnlyHotelPriceSearchEncrypt(locations, date, nights)
            .then(products => ({
              hotelName: hotel.name,
              date,
              nights,
              products
            }))
        );
      }
    }

    // 3. Выполним все запросы параллельно
    const results = await Promise.all(allRequests);

    console.log("All fetched hotel price results:", results);

    // 4. Красиво выведем на страницу
    const result = document.createElement("pre");
    result.style = "background: #f4f4f4; padding: 10px; border-radius: 6px; margin: 20px;";
    result.textContent = JSON.stringify(results, null, 2);
    document.body.appendChild(result);

  } catch (err) {
    console.error("Error fetching hotel data", err);
  }
});

document.body.insertAdjacentElement('afterbegin', action);
