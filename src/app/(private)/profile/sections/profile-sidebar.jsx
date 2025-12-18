"use client"

/**
 * ProfileSidebarSection
 * Navigation sidebar for profile pages with tab switching and logout
 * Used in profile/edit/page.jsx
 */
export function ProfileSidebarSection({ activeTab, onTabChange, onLogout }) {
  return (
    <div className="w-64 bg-[#F7F7F8] min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="space-y-8">
          {/* PROFILE Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PROFILE</h3>
            <nav className="space-y-1">
              <button
                onClick={() => onTabChange("edit")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "edit"
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
                onClick={() => onTabChange("purchases")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "purchases"
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
  );
}
