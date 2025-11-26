"use client";
import React, { createContext, useState, useEffect } from "react";
import baseRequest from "../utils/baseRequest";

export const AuthContext = createContext();

const API_URL =
 process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : "http://localhost:8000/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await baseRequest.get(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        setUser(null);
        localStorage.removeItem("user");
      }
    }

    fetchUser();
  }, [token]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
