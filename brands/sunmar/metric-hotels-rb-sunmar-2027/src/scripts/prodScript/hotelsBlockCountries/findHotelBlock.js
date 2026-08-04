export async function findHotelBlock(event) {

    const button = event.target.closest('.hotels__button');
    if (!button) {return;}

    const block = button.closest('.hotels__item');
    if (block) {
        const hotelName = block.querySelector('.hotels__hotel-name')?.textContent.trim();
        let countryName = null;

        if (block.closest('[aria-labelledby="hotels-1-tab-turkey"]')){
            countryName = 'Turkey';
        } else if (block.closest('[aria-labelledby="hotels-1-tab-egypt"]')) {
            countryName = 'Egypt';
        } else if (block.closest('[aria-labelledby="hotels-1-tab-uae"]')) {
            countryName = 'UAE';
        }

        if (countryName) {
            return {countryName, hotelName};
        }
    }
}