import { AuthProvider } from "@/context/AuthProvider"

export default function PrivateLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}