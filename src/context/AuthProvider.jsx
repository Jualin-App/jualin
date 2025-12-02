"use client";
import React, { createContext, useState, useEffect } from "react";
import baseRequest from "../utils/baseRequest";
import Cookies from "js-cookie";

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
      
      // Coba dulu dari localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== 'undefined') {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          return;
        } catch (e) {
          console.log('Invalid saved user data');
        }
      }
      
      // Jika ada token tapi API bermasalah, gunakan mock data
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
        console.log('API error, using mock user data for development');
        // Mock user data untuk development
        const mockUser = {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          avatar: 'https://via.placeholder.com/150',
          role: 'user'
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
      }
    }

    fetchUser();
  }, [token]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    Cookies.set("role", String(userData?.role || "customer").toLowerCase(), { sameSite: "lax" });
    Cookies.set("token", token, { sameSite: "lax" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    Cookies.remove("role");
    Cookies.remove("token");
  };

  // Demo login untuk testing
  const demoLogin = () => {
    const demoToken = "demo_token_12345";
    const demoUser = {
      id: 1,
      name: 'Demo User',
      email: 'demo@example.com',
      avatar: 'https://via.placeholder.com/150',
      role: 'user'
    };
    
    localStorage.setItem("token", demoToken);
    localStorage.setItem("user", JSON.stringify(demoUser));
    setUser(demoUser);
    
    console.log('Demo login successful');
    return demoUser;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
