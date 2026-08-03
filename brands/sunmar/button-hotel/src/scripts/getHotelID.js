import { waitForElement } from '@utils';

export async function getHotelId() {
    try {
        await waitForElement('.hotel-container');

        const dl = window.dataLayer || [];
        const event = dl.find(item => item?.event === 'view_item');

        return event?.ecommerce?.items?.[0]?.item_id?.toString() || null;
    } catch (error) {
        return null;
    }
}