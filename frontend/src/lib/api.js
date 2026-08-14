import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "/api"}/notes`.replace(/\/notes$/, ""),
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export const isRateLimitError = (error) => error.response?.status === 429;

export const getErrorMessage = (error, fallback) => {
  if (isRateLimitError(error)) return "Too many requests. Please wait a moment and try again.";
  return error.response?.data?.message || fallback;
};

export default api;
