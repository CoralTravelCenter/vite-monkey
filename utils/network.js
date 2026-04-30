import { endpointUrl } from './url.js';

export async function doRequestToServer(endpoint, data, method = "POST") {
    try {
        const url = endpointUrl(endpoint);
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText} for ${endpoint}`);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error in doRequestToServer for endpoint ${endpoint}:`, error);
        throw error;
    }
}
