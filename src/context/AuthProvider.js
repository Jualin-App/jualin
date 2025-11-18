"use client"
import { createContext, useContext, useMemo, useState, useEffect } from "react"
import baseRequest from "@/utils/baseRequest";

const AuthContext = createContext({ 
  user: null, 
  updateUser: () => {},
  loading: true,
  login: async () => {},
  logout: async () => {}
})

export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser || null)
  const [loading, setLoading] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await baseRequest.get("/me");
        if (res?.data) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }
    
    if (!initialUser && token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const updateUser = (data) => {
    setUser(prev => ({ ...(prev || {}), ...(data || {}) }))
    if (data) {
      localStorage.setItem("user", JSON.stringify({ ...(user || {}), ...(data || {}) }));
    }
  }

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await baseRequest.post("/login", credentials);
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user || res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
        return { success: true, data: res.data };
      }
      return { success: false, message: res?.data?.message || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await baseRequest.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const value = useMemo(() => ({ 
    user, 
    updateUser, 
    loading,
    login,
    logout
  }), [user, loading])
  
  if (!mounted) {
    return <AuthContext.Provider value={{ user: null, updateUser: () => {}, loading: true, login: async () => ({ success: false }), logout: async () => {} }}>{children}</AuthContext.Provider>;
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)