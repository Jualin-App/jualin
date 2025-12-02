'use client';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { AuthContext } from '../../../context/AuthProvider.jsx';

export default function EditProfilePage() {
  const router = useRouter()
  const { user, setUser } = useContext(AuthContext)
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
        setUser(result.data)
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

  return (
    <div className="min-h-screen bg-white">
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#F7F7F8] min-h-screen">
          <div className="p-6">
            <div className="space-y-8">
              {/* PROFILE Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PROFILE</h3>
                <nav className="space-y-1">
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-[#E53935] rounded-lg"
                  >
                    <svg className="mr-3 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Edit Profile
                  </a>
                </nav>
              </div>




            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          <div className="max-w-5xl mx-auto p-8">
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
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#1F1F1F] hover:bg-gray-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
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
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowPasswordForm(false)}
                    className="px-4 py-2 text-[#1F1F1F] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={onSubmit}
                    disabled={loading}
                    className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Save changes
                  </button>
                </div>
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
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#1F1F1F] hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
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
                          className={`h-1 flex-1 rounded ${
                            passwordForm.newPassword.length >= level * 2 
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
          </div>
        </div>
      </div>
    </div>
  )
}