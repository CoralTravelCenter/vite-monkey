export function checkLayer() {
    const dataOnLayer = window.dataLayer[1]?.ecommerce?.items?.[0]?.item_name?.toString();
    console.log(dataOnLayer);
}