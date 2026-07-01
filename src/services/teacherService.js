import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getTeachers = () => axios.get(`${API_BASE}/user/role/teacher`);

export const deleteTeacher = (email) =>
  axios.delete(`${API_BASE}/user/delete/${email}`);

export const updateTeacher = (data) =>
  axios.put(`${API_BASE}/user`, data);
