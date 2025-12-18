"use client"
import { useState } from 'react';

/**
 * PasswordChangeSection
 * Collapsible password change form with validation and strength indicator
 * Used in profile/edit/page.jsx
 */
export function PasswordChangeSection({
  form,
  errors,
  isLoading,
  onFieldChange,
  onSubmit
}) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    const result = await onSubmit();
    if (result.success) {
      setShowForm(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#1F1F1F]">Change Password</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#1F1F1F] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      {showForm && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Current Password *</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={e => onFieldChange("currentPassword", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.currentPassword ? "border-red-500" : "border-gray-200"}`}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">New Password *</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={e => onFieldChange("newPassword", e.target.value)}
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
                    form.newPassword.length >= level * 2
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
              value={form.confirmPassword}
              onChange={e => onFieldChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] outline-none transition-colors text-black ${errors.confirmPassword ? "border-red-500" : "border-gray-200"}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Changing...' : 'Set new password'}
          </button>
        </div>
      )}
    </div>
  );
}
