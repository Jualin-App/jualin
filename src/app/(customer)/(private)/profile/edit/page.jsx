"use client"
import { useEffect, useMemo, useState, useContext } from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/context/AuthProvider"
import { api } from "@/lib/axios"
import Navbar from "@/components/ui/Navbar"

// Mock Data for Purchase History
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    vendorName: "Office Supplies Co.",
    description: "Printer cartridges and paper",
    amount: 20000,
    date: "2025-10-03",
    category: "Office"
  },
  {
    id: 2,
    vendorName: "Tech Gadgets Inc.",
    description: "Wireless Mouse",
    amount: 150000,
    date: "2025-09-28",
    category: "Electronics"
  },
  {
    id: 3,
    vendorName: "Coffee Bean",
    description: "Monthly coffee subscription",
    amount: 50000,
    date: "2025-09-25",
    category: "Food & Beverage"
  },
  {
    id: 4,
    vendorName: "Cloud Services",
    description: "Annual server hosting",
    amount: 1200000,
    date: "2025-09-15",
    category: "SaaS"
  },
  {
    id: 5,
    vendorName: "Design Assets",
    description: "Icon pack license",
    amount: 35000,
    date: "2025-09-10",
    category: "Software"
  }
]

export default function EditProfilePage() {
  const router = useRouter()
  const { user, setUser, logout } = useContext(AuthContext)

  // Tab State
  const [activeTab, setActiveTab] = useState("edit") // 'edit' | 'purchases'

  // Purchase History State
  const [dateFilter, setDateFilter] = useState({ start: "2025-01-01", end: "2025-10-03" })
  const [purchasePage, setPurchasePage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Profile Edit State
  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }
  const initial = useMemo(
    () => ({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
      profilePicture: user?.profilePicture || "",
    }),
    [user]
  )
  const [form, setForm] = useState(initial)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initial.profilePicture || "")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    setForm(initial)
    setImagePreview(initial.profilePicture || "")
  }, [initial])

  // Derived State for Purchases
  const totalAmount = useMemo(() => {
    return MOCK_TRANSACTIONS.reduce((acc, curr) => acc + curr.amount, 0)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  // Handlers
  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const onPasswordChange = (key, value) => {
    setPasswordForm(prev => ({ ...prev, [key]: value }))
  }

  const onImageSelect = (file, previewUrl) => {
    setImageFile(file)
    setImagePreview(previewUrl)
  }

  const validate = () => {
    const e = {}
    if (!form.fullName?.trim()) e.fullName = "Full name required"
    if (!form.email?.trim() || !/.+@.+\..+/.test(form.email)) e.email = "Valid email required"
    if (form.phone && !/^\+?\d{7,15}$/.test(form.phone)) e.phone = "Phone must be 7-15 digits"
    if (!form.location?.trim()) e.location = "Location required"
    if (form.bio?.length > 500) e.bio = "Bio max 500 chars"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validatePassword = () => {
    const e = {}
    if (!passwordForm.currentPassword) e.currentPassword = "Current password required"
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) e.newPassword = "Password must be at least 6 characters"
    if (passwordForm.newPassword !== passwordForm.confirmPassword) e.confirmPassword = "Passwords do not match"
    return e
  }

  const onSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      let res
      if (imageFile) {
        const fd = new FormData()
        fd.append("fullName", form.fullName)
        fd.append("email", form.email)
        fd.append("phone", form.phone || "")
        fd.append("location", form.location)
        fd.append("bio", form.bio || "")
        fd.append("profilePicture", imageFile)
        res = await api.patch("/profile/update", fd)
      } else {
        const body = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || "",
          location: form.location,
          bio: form.bio || "",
          profilePicture: form.profilePicture || "",
        }
        res = await api.patch("/profile/update", body)
      }

      const result = res?.data ?? res
      if (result?.success) {
        updateUser(result.data)
        setToast({ type: "success", message: result.message || "Profile updated" })
        setTimeout(() => router.push("/profile"), 800)
      } else {
        setToast({ type: "error", message: result?.message || "Failed to update" })
      }
    } catch (err) {
      setToast({ type: "error", message: "Unexpected error" })
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async () => {
    const passwordErrors = validatePassword()
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors)
      return
    }

    setLoading(true)
    try {
      const res = await api.patch("/profile/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })

      const result = res?.data ?? res
      if (result?.success) {
        setToast({ type: "success", message: "Password changed successfully" })
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setShowPasswordForm(false)
      } else {
        setToast({ type: "error", message: result?.message || "Failed to change password" })
      }
    } catch (err) {
      setToast({ type: "error", message: "Failed to change password" })
    } finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    router.back()
  }

  const onLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#F7F7F8] min-h-screen flex flex-col">
          <div className="p-6 flex-1">
            <div className="space-y-8">
              {/* PROFILE Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PROFILE</h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "edit"
                      ? "bg-[#E53935] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <svg className={`mr-3 h-4 w-4 ${activeTab === "edit" ? "text-white" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("purchases")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "purchases"
                      ? "bg-[#E53935] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <svg className={`mr-3 h-4 w-4 ${activeTab === "purchases" ? "text-white" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Riwayat Pembelian
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-6 mt-auto">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center px-4 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          <div className="max-w-5xl mx-auto p-8">

            {activeTab === "edit" ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-semibold text-[#1F1F1F]">Edit Profile</h1>
                  <div className="flex gap-3">
                    <button
                      onClick={onCancel}
                      className="px-4 py-2 text-[#1F1F1F] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onSubmit}
                      disabled={loading}
                      className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>

                {/* Toast */}
                {toast && (
                  <div className={`mb-6 rounded-lg p-4 ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {toast.message}
                  </div>
                )}

                {/* Profile Photo and Upload */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                  <div className="flex items-center gap-8">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={() => document.getElementById('profilePicture').click()}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-[#1F1F1F] rounded-lg transition-colors text-sm font-medium"
                      >
                        Upload new photo
                      </button>
                      <p className="text-xs text-[#9CA3AF] mt-2">At least 800×800 px recommended. JPG or PNG is allowed</p>
                      <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const previewUrl = URL.createObjectURL(file)
                            onImageSelect(file, previewUrl)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Info Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#1F1F1F]">Personal Info</h2>

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Full Name</label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={e => onChange("fullName", e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.fullName ? "border-red-500" : "border-gray-200"}`}
                        placeholder="Your name"
                      />
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => onChange("email", e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.email ? "border-red-500" : "border-gray-200"}`}
                        placeholder="name@example.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => onChange("phone", e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.phone ? "border-red-500" : "border-gray-200"}`}
                        placeholder="(+62) 8123456789"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#1F1F1F]">Location</h2>

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={form.location}
                        onChange={e => onChange("location", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.location ? "border-red-500" : "border-gray-200"}`}
                        placeholder="Your location"
                      />
                    </div>
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                  </div>
                </div>

                {/* Bio Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#1F1F1F]">Bio</h2>

                  </div>
                  <div>
                    <textarea
                      value={form.bio}
                      onChange={e => onChange("bio", e.target.value)}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors resize-none text-black ${errors.bio ? "border-red-500" : "border-gray-200"}`}
                      placeholder="Tell us about yourself"
                    />
                    {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                    <p className="mt-2 text-sm text-[#9CA3AF]">{form.bio.length}/500 characters</p>
                  </div>

                </div>

                {/* Change Password Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#1F1F1F]">Change Password</h2>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#1F1F1F] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Current Password *</label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={e => onPasswordChange("currentPassword", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.currentPassword ? "border-red-500" : "border-gray-200"}`}
                          placeholder="Enter your current password"
                        />
                        {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9CA3AF] mb-2">New Password *</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={e => onPasswordChange("newPassword", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.newPassword ? "border-red-500" : "border-gray-200"}`}
                          placeholder="Enter your new password"
                        />
                        {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                        {/* Password strength indicator */}
                        <div className="mt-2 flex space-x-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded ${passwordForm.newPassword.length >= level * 2
                                ? level <= 2 ? "bg-red-500" : level === 3 ? "bg-yellow-500" : "bg-green-500"
                                : "bg-gray-200"
                                }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Confirm Password *</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={e => onPasswordChange("confirmPassword", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.confirmPassword ? "border-red-500" : "border-gray-200"}`}
                          placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                      </div>

                      <button
                        onClick={onPasswordSubmit}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Set new password
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Purchase History Content
              <div>
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold text-[#1F1F1F] mb-4">Riwayat Pembelian</h1>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Date Filter */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-fit">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="date"
                        value={dateFilter.start}
                        onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                        className="text-sm text-[#1F1F1F] outline-none"
                      />
                      <span className="text-gray-400">–</span>
                      <input
                        type="date"
                        value={dateFilter.end}
                        onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                        className="text-sm text-[#1F1F1F] outline-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <button className="text-sm font-medium text-[#E53935] hover:text-[#D32F2F] transition-colors">
                        Show All Purchases
                      </button>
                      <button className="text-sm font-medium text-[#E53935] hover:text-[#D32F2F] transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export to CSV
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
                  <h2 className="text-3xl font-bold text-[#1F1F1F]">{formatCurrency(totalAmount)}</h2>
                </div>

                {/* Transaction List */}
                <div className="space-y-4 mb-8">
                  {MOCK_TRANSACTIONS.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="group bg-white border-b border-gray-100 p-4 hover:bg-[#F7F7F8] rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-[#1F1F1F] mb-1">{transaction.vendorName}</h3>
                          <p className="text-sm text-gray-500 mb-3">{transaction.description}</p>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(transaction.date)}
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
                              {transaction.category}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-semibold text-[#1F1F1F]">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                      disabled={purchasePage === 1}
                      onClick={() => setPurchasePage(p => Math.max(1, p - 1))}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        onClick={() => setPurchasePage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${purchasePage === page
                          ? "bg-[#E53935] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                      onClick={() => setPurchasePage(p => p + 1)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show per page</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="text-sm border-none bg-transparent font-medium text-[#1F1F1F] outline-none cursor-pointer hover:text-[#E53935]"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
