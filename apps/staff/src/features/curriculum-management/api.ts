import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";
import type { CourseOption, Curriculum } from "./types";

export type StaffSession = {
  _id?: string;
  name?: string;
  email?: string;
  number?: string;
  role?: string;
  brandKey?: string;
  assignedBrandKeys?: string[];
  isBlock?: boolean;
  token?: string;
};

const jsonHeaders = () => ({
  "Content-Type": "application/json",
  ...getBrandHeaders(),
  ...getAuthHeaders(),
});

const getStoredToken = () => {
  if (typeof window === "undefined") return "";
  const token = window.localStorage.getItem("token");
  if (token) return token;

  try {
    const storedUser = window.localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser?.token || "";
  } catch {
    return "";
  }
};

export const clearStoredAuth = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
};

const getAuthHeaders = () => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body?.success === false) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Admin session expired or not permitted. Please log in again.");
    }
    throw new Error(body?.error || body?.message || "Request failed");
  }
  return body;
}

export async function verifyAdminSession(): Promise<StaffSession> {
  if (!getStoredToken()) {
    throw new Error("Admin session expired or not permitted. Please log in again.");
  }

  const response = await fetch(`${getApiBaseUrl()}/user`, {
    headers: { ...getBrandHeaders(), ...getAuthHeaders() },
    cache: "no-store",
  });
  const session = await parseResponse<StaffSession>(response);

  if (session.role !== "admin") {
    throw new Error("Admin session expired or not permitted. Please log in again.");
  }

  if (session.token && typeof window !== "undefined") {
    window.localStorage.setItem("token", session.token);
    window.localStorage.setItem("user", JSON.stringify(session));
  }

  return session;
}

export async function fetchCurriculums(): Promise<Curriculum[]> {
  const response = await fetch(`${getApiBaseUrl()}/curriculums?status=all`, {
    headers: { ...getBrandHeaders(), ...getAuthHeaders() },
    cache: "no-store",
  });
  const body = await parseResponse<{ data: Curriculum[] }>(response);
  return body.data || [];
}

export async function saveCurriculum(curriculum: Curriculum): Promise<Curriculum> {
  const endpoint = curriculum._id
    ? `${getApiBaseUrl()}/curriculums/${curriculum._id}`
    : `${getApiBaseUrl()}/curriculums`;
  const response = await fetch(endpoint, {
    method: curriculum._id ? "PATCH" : "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(curriculum),
  });
  const body = await parseResponse<{ data: Curriculum }>(response);
  return body.data;
}

export async function duplicateCurriculum(curriculumId: string): Promise<Curriculum> {
  const response = await fetch(`${getApiBaseUrl()}/curriculums/${curriculumId}/duplicate`, {
    method: "POST",
    headers: jsonHeaders(),
  });
  const body = await parseResponse<{ data: Curriculum }>(response);
  return body.data;
}

export async function archiveCurriculum(curriculumId: string): Promise<Curriculum> {
  const response = await fetch(`${getApiBaseUrl()}/curriculums/${curriculumId}`, {
    method: "DELETE",
    headers: { ...getBrandHeaders(), ...getAuthHeaders() },
  });
  const body = await parseResponse<{ data: Curriculum }>(response);
  return body.data;
}

export async function fetchAdminCourses(): Promise<CourseOption[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/course/admin`, {
      headers: { ...getBrandHeaders(), ...getAuthHeaders() },
      cache: "no-store",
    });
    const body = await parseResponse<{ data: CourseOption[] }>(response);
    return body.data || [];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin session")) {
      throw error;
    }

    const publicResponse = await fetch(`${getApiBaseUrl()}/course`, {
      headers: { ...getBrandHeaders() },
      cache: "no-store",
    });
    const body = await parseResponse<{ data: CourseOption[] }>(publicResponse);
    return body.data || [];
  }
}

export async function assignCurriculumToCourse(courseId: string, curriculumId: string) {
  const response = await fetch(`${getApiBaseUrl()}/course/${courseId}/curriculum`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ curriculumId }),
  });
  return parseResponse(response);
}

export async function uploadCurriculumFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiBaseUrl()}/images`, {
    method: "POST",
    headers: {
      ...getBrandHeaders(),
      ...getAuthHeaders(),
    },
    body: formData,
  });

  const body = await parseResponse<{ url?: string; data?: { url?: string } }>(response);
  const url = body.url || body.data?.url;
  if (!url) {
    throw new Error("Upload finished but no file URL was returned.");
  }
  return url;
}
