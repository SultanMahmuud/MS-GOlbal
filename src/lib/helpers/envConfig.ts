export const envConfig = {
    baseApi: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BaseApi || process.env.NEXT_PUBLIC_API_URL,
    baseUrl: process.env.NEXT_PUBLIC_BaseUrl,
    appKind: process.env.NEXT_PUBLIC_APP_KIND || "legacy",
    brandKey: process.env.NEXT_PUBLIC_BRAND_KEY || "muslim-school",
    google_analytics_code: process.env.NEXT_PUBLIC_google_analytics_code,
    file_stroge_baseUrl: process.env.NEXT_PUBLIC_file_stroge_baseUrl,


};
