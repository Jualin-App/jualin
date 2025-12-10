"use client";
import React, { createContext, useState, useEffect } from "react";
import baseRequest from "../utils/baseRequest";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { api } from "@/lib/axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "http://localhost:8000/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const syncUserToFirestore = async (userData) => {
    try {
      const userRef = doc(db, "users", userData.id.toString());

      await setDoc(
        userRef,
        {
          id: userData.id.toString(),
          name: userData.name || userData.username || userData.email,
          email: userData.email,
          avatar: userData.avatar || userData.profile_picture || null,
          role: userData.role || "buyer",
          updatedAt: new Date(),  
        },
        { merge: true }
      ); // merge: true = update tanpa hapus field lain

      console.log("✅ User synced to Firestore:", userData.id);
    } catch (error) {
      console.error("❌ Error syncing user to Firestore:", error);
      // Tidak throw error, karena sync adalah optional
    }
  };

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

        syncUserToFirestore(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
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

  const logout = async () => {
    const accessToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      await api.post(
        "/api/v1/logout",
        null,
        accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : undefined
      );
    } catch (error) {
      console.error("Error logging out:", error);
      // Tetap lanjut bersihkan token di client agar user benar-benar keluar
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      setUser(null);
      Cookies.remove("role");
      Cookies.remove("token");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
