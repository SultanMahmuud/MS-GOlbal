import type { AppKind, BrandKey } from "@qawmi/shared-api";
import { getApiBaseUrl, getBrandHeaders } from "@qawmi/shared-api";

export type LoginPayload = {
  email: string;
  password: string;
  expectedRole: "student" | "teacher" | "admin";
  brandKey?: BrandKey;
  appKind: AppKind;
};

export async function login(payload: LoginPayload) {
  const response = await fetch(`${getApiBaseUrl()}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getBrandHeaders(payload.brandKey || "muslim-school", payload.appKind)
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}
