"use client"

/**
 * ProfileFormSection
 * Edit profile form with photo upload, personal info, location, and bio
 * Used in profile/edit/page.jsx
 */
export function ProfileFormSection({
  form,
  errors,
  imagePreview,
  onFieldChange,
  onImageSelect
}) {
  return (
    <>
      {/* Profile Photo and Upload */}
      <div className="bg-white rounded-xl p-8 mb-8 shadow-md hover:shadow-lg transition-all duration-200">
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
              className="px-6 py-2 bg-white hover:bg-white text-[#1F1F1F] rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg focus:shadow-xl outline-none"
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
                const file = e.target.files?.[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  onImageSelect(file, previewUrl);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Personal Info Card */}
      <div className="bg-white rounded-xl p-8 mb-8 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1F1F1F]">Personal Info</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => onFieldChange("fullName", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 bg-white text-black shadow-md hover:shadow-lg focus:shadow-xl ${errors.fullName ? "shadow-red-300 focus:shadow-red-400" : ""}`}
              placeholder="Your name"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => onFieldChange("email", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 bg-white text-black shadow-md hover:shadow-lg focus:shadow-xl ${errors.email ? "shadow-red-300 focus:shadow-red-400" : ""}`}
              placeholder="name@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => onFieldChange("phone", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 bg-white text-black shadow-md hover:shadow-lg focus:shadow-xl ${errors.phone ? "shadow-red-300 focus:shadow-red-400" : ""}`}
              placeholder="(+62) 8123456789"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-xl p-8 mb-8 shadow-md hover:shadow-lg transition-all duration-200">
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
              onChange={e => onFieldChange("location", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200 bg-white text-black shadow-md hover:shadow-lg focus:shadow-xl ${errors.location ? "shadow-red-300 focus:shadow-red-400" : ""}`}
              placeholder="Your location"
            />
          </div>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-white rounded-xl p-8 mb-8 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1F1F1F]">Bio</h2>
        </div>
        <div>
          <textarea
            value={form.bio}
            onChange={e => onFieldChange("bio", e.target.value)}
            rows={6}
            className={`w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 bg-white text-black shadow-md hover:shadow-lg focus:shadow-xl resize-none ${errors.bio ? "shadow-red-300 focus:shadow-red-400" : ""}`}
            placeholder="Tell us about yourself"
          />
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
          <p className="mt-2 text-sm text-[#9CA3AF]">{form.bio.length}/500 characters</p>
        </div>
      </div>
    </>
  );
}
