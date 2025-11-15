"use client"
import { createContext, useContext, useMemo, useState } from "react"

const AuthContext = createContext({ user: null, updateUser: () => {} })

export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser || null)

  const updateUser = (data) => {
    setUser(prev => ({ ...(prev || {}), ...(data || {}) }))
  }

  const value = useMemo(() => ({ user, updateUser }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)