import axios from "axios";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";

const API_BASE = getApiBaseUrl();

const authHeaders = () => {
  if (typeof window === "undefined") return getBrandHeaders();
  const token = window.localStorage.getItem("token");
  return token
    ? { ...getBrandHeaders(), Authorization: `Bearer ${token}` }
    : getBrandHeaders();
};

export const getTeachers = () =>
  axios.get(`${API_BASE}/user/role/teacher?limit=all`, { headers: authHeaders() });

export const createTeacher = (data) =>
  axios.post(`${API_BASE}/user/signup/teacher`, data, { headers: authHeaders() });

export const deleteTeacher = (email) =>
  axios.delete(`${API_BASE}/user/delete/${encodeURIComponent(email)}`, {
    headers: authHeaders(),
  });

export const updateTeacher = (data) =>
  axios.put(`${API_BASE}/user`, data, { headers: authHeaders() });
