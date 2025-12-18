"use client"

/**
 * ProfileHeaderSection
 * Displays read-only profile information
 * Used in profile/page.jsx
 */
export function ProfileHeaderSection({ user }) {
  return (
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
  );
}
