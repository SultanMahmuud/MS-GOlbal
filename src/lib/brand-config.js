export const DEFAULT_BRAND_KEY = "muslim-school";

export const BRAND_CONFIGS = {
  "muslim-school": {
    key: "muslim-school",
    name: "Muslim School",
    domain: "muslimschoool.com",
    appUrl: "https://muslimschoool.com",
    theme: {
      primaryColor: "#14532d",
      accentColor: "#f59e0b",
    },
  },
  "quran-care": {
    key: "quran-care",
    name: "Quran Care",
    domain: "quran.care",
    appUrl: "https://quran.care",
    theme: {
      primaryColor: "#0f766e",
      accentColor: "#38bdf8",
    },
  },
  murshiid: {
    key: "murshiid",
    name: "Murshiid",
    domain: "murshiid.com",
    appUrl: "https://murshiid.com",
    theme: {
      primaryColor: "#312e81",
      accentColor: "#c084fc",
    },
  },
};

export const getAppKind = () => process.env.NEXT_PUBLIC_APP_KIND || "legacy";

export const getBrandKey = () =>
  process.env.NEXT_PUBLIC_BRAND_KEY || DEFAULT_BRAND_KEY;

export const getBrandConfig = (key = getBrandKey()) =>
  BRAND_CONFIGS[key] || BRAND_CONFIGS[DEFAULT_BRAND_KEY];

export const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BaseApi ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

export const getBrandHeaders = () => ({
  "X-App-Kind": getAppKind(),
  "X-Brand-Key": getBrandKey(),
});

export const getDashboardPath = (role) => {
  if (role === "admin") return "/dashboard/admin/adminDashboard";
  if (role === "teacher") return "/dashboard/teacher";
  return "/dashboard/student";
};
