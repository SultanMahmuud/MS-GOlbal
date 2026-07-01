import { getApiBaseUrl, getBrandHeaders } from "./brand-config";

export const safeFetchJson = async (
  path,
  { fallback = null, headers, ...init } = {}
) => {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...getBrandHeaders(),
        ...headers,
      },
    });

    if (!response.ok) {
      return fallback;
    }

    return await response.json();
  } catch (error) {
    console.error(`API fetch failed for ${path}:`, error);
    return fallback;
  }
};
