import Cookies from "js-cookie";
import axios from 'axios';
import { fetch as baseFetch } from "@/utils/baseFetch";

// Create axios instance with interceptors
export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}` || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Legacy Auth object untuk backward compatibility
const Auth = {
  login: async (payload) => {
    const res = await baseFetch({ url: "/login", method: "POST", payload });
    const data = res?.data ?? res;
    const accessToken = data?.data?.accessToken || data?.accessToken;
    const refreshToken = data?.data?.refreshToken || data?.refreshToken;
    if (accessToken) Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
    if (refreshToken) Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" });
    return data;
  },
  register: async (payload) => {
    const res = await baseFetch({ url: "/register", method: "POST", payload });
    return res;
  },
  logout: async () => {
    try {
      await baseFetch({ url: "/logout", method: "POST" });
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage.removeItem('token');
    }
  },
  me: async () => {
    const res = await baseFetch({ url: "/me", method: "GET" });
    return res;
  },
};

export default Auth;