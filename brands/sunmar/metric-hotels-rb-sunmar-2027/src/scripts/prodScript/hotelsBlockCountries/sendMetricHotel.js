export function sendMetricHotel(countryName, hotelName) {
    if (!countryName || !hotelName) {return;}
    if (countryName && typeof window.ym === 'function') {
        window.ym(215233, "reachGoal", "eb_winter_2027_select_hotel_click", {
            country: {
                [countryName]: {
                    name_hotel: `«${hotelName}»`
                }
            }
        });
    }
}