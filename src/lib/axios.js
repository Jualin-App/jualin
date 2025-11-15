import Cookies from "js-cookie";
import { fetch as baseFetch } from "@/utils/baseFetch";

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
    }
  },
  me: async () => {
    const res = await baseFetch({ url: "/me", method: "GET" });
    return res;
  },
};

export default Auth;