"use client"
import { useAuth } from "@/context/AuthProvider"
import { useRouter } from "next/navigation"
import Header from "@/components/common/Header"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <button 
              onClick={() => router.push(`/profile/edit?id=${user?.id || user?._id || user?.userId || ''}`)}
              className="px-4 py-2 rounded-md bg-red-600 text-white"
            >
              Edit Profile
            </button>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{user?.fullName || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{user?.phone || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-sm text-gray-900">{user?.location || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <p className="mt-1 text-sm text-gray-900">{user?.bio || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}