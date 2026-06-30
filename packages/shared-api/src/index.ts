export type AppKind = "brand" | "staff";
export type BrandKey = "muslim-school" | "quran-care" | "murshiid";

declare const process: {
  env: Record<string, string | undefined>;
};

export type BrandConfig = {
  key: BrandKey;
  name: string;
  domain: string;
  appUrl: string;
  kind: AppKind;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    ink: string;
  };
};

export const brandConfigs: Record<BrandKey, BrandConfig> = {
  "muslim-school": {
    key: "muslim-school",
    name: "Muslim School",
    domain: "muslimschoool.com",
    appUrl: "https://muslimschoool.com",
    kind: "brand",
    theme: {
      primary: "#0f7a53",
      secondary: "#0f172a",
      accent: "#f59e0b",
      surface: "#f8fafc",
      ink: "#10231c"
    }
  },
  "quran-care": {
    key: "quran-care",
    name: "Quran Care",
    domain: "quran.care",
    appUrl: "https://quran.care",
    kind: "brand",
    theme: {
      primary: "#075e63",
      secondary: "#12343b",
      accent: "#6ee7b7",
      surface: "#f1fbfa",
      ink: "#062d33"
    }
  },
  murshiid: {
    key: "murshiid",
    name: "Murshiid",
    domain: "murshiid.com",
    appUrl: "https://murshiid.com",
    kind: "brand",
    theme: {
      primary: "#2f2a77",
      secondary: "#17132f",
      accent: "#d7b56d",
      surface: "#f7f5ff",
      ink: "#191532"
    }
  }
};

export const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BaseApi ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export const getBrandHeaders = (brandKey: BrandKey, appKind: AppKind = "brand") => ({
  "X-App-Kind": appKind,
  "X-Brand-Key": brandKey
});

export async function fetchJson<T>(
  path: string,
  options: RequestInit & {
    appKind?: AppKind;
    brandKey?: BrandKey;
    fallback: T;
    next?: {
      revalidate?: number | false;
      tags?: string[];
    };
  }
): Promise<T> {
  const { appKind = "brand", brandKey = "muslim-school", fallback, headers, ...init } = options;

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: {
        ...getBrandHeaders(brandKey, appKind),
        ...headers
      }
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}
