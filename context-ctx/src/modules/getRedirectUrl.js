import {fetchJSON} from "../utils.js";

export async function getRedirectURL(departureID, departure, friendlyUrl, neededDate, arrivalLocations, targetNights, filterStr) {

  const departureLocations = [{
    id: departureID,
    name: departure,
    type: 5,
    friendlyUrl,
  }];


  const sendData = {
    flightType: 2,
    reservationType: 1,
    beginDates: [neededDate.date, neededDate.date],
    datePickerMode: 0,
    nights: [{value: targetNights.value}],
    roomCriterias: [{passengers: [{age: 20, passengerType: 0}, {age: 20, passengerType: 0}]}],
    departureLocations,
    arrivalLocations,
    paging: {pageNumber: 1, pageSize: 20, sortType: 0},
    additionalFilters: filterStr ? filterStr : [],
    imageSizes: [0],
  };

  return fetchJSON("https://b2capi.coral.ru/PackageTourHotelProduct/PriceSearchEncrypt", sendData);
}
