export async function getHotelId() {
    return new Promise((resolve) => {
        let cursor = 0;

        const timer = setInterval(() => {
            const dl = window.dataLayer || [];
            for (let i = cursor; i < dl.length; i++) {
                if (dl[i]?.event === 'view_item') {
                    const id = dl[i]?.ecommerce?.items?.[0]?.item_id;
                    if (id) {
                        clearInterval(timer);
                        return resolve(id.toString());
                    }
                }
            }
            cursor = dl.length;
        }, 300);

        setTimeout(() => {
            clearInterval(timer);
            resolve(null);
        }, 10000);
    });
}