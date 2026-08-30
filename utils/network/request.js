import { endpointUrl } from "./url.js";

export async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function doRequestToServer(endpoint, data, method = "POST") {
  try {
    const url = endpointUrl(endpoint);
    return await requestJson(url, {
      method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(
      `Error in doRequestToServer for endpoint ${endpoint}:`,
      error,
    );
    throw error;
  }
}
