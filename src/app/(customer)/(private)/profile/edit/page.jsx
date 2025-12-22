"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import Navbar from "@/components/ui/Navbar";
import { useProfileUpdate } from "@/hooks/profile/useProfileUpdate";
import { usePasswordChange } from "@/hooks/profile/usePasswordChange";
import { usePurchaseHistory } from "@/hooks/profile/usePurchaseHistory";
import { ProfileFormSection } from "../sections/profile-form";
import { PasswordChangeSection } from "../sections/password-change";
import { PurchaseHistorySection } from "../sections/purchase-history";
import { ProfileSidebarSection } from "../sections/profile-sidebar";

export default function EditProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'purchases'

  // Toast state
  const [toast, setToast] = useState(null);

  // Profile update hook
  const profileUpdate = useProfileUpdate();

  // Password change hook
  const passwordChange = usePasswordChange();

  // Purchase history hook
  const purchaseHistory = usePurchaseHistory();

  // Handlers
  const handleCancel = () => {
    router.back();
  };

  const handleSaveProfile = async () => {
    const result = await profileUpdate.submit();

    if (result.success) {
      setToast({
        type: "success",
        message: result.message || "Profile updated",
      });
      setTimeout(() => router.push("/profile"), 800);
    } else {
      setToast({
        type: "error",
        message: result.message || "Failed to update",
      });
    }
  };

  const handlePasswordSubmit = async () => {
    const result = await passwordChange.submit();

    if (result.success) {
      setToast({ type: "success", message: result.message });
    } else {
      setToast({ type: "error", message: result.message });
    }

    return result;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.push("/auth/login");
    }
  };

  const handleExportCSV = () => {
    const data = purchaseHistory.purchases;
    if (!data || data.length === 0) {
      setToast({ type: "error", message: "No purchase history to export" });
      return;
    }

    // CSV Headers
    const headers = ["Order ID", "Vendor", "Description", "Date", "Category", "Amount"];

    // Format data rows with proper escaping
    const csvRows = data.map(item => {
      const row = [
        item.id,
        `"${(item.vendorName || "").replace(/"/g, '""')}"`,
        `"${(item.description || "").replace(/"/g, '""')}"`,
        item.date ? new Date(item.date).toLocaleDateString() : "",
        `"${(item.category || "").replace(/"/g, '""')}"`,
        item.amount
      ];
      return row.join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `purchase_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <ProfileSidebarSection
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 bg-white">
          <div className="max-w-5xl mx-auto p-8">
            {activeTab === "edit" ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-semibold text-[#1F1F1F]">
                    Edit Profile
                  </h1>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileUpdate.isLoading}
                      className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md outline-none"
                    >
                      {profileUpdate.isLoading ? "Saving..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </div>

                {/* Toast */}
                {toast && (
                  <div
                    className={`mb-6 rounded-lg p-4 shadow-md ${toast.type === "success"
                      ? "bg-green-50 text-green-700 shadow-green-200"
                      : "bg-red-50 text-red-700 shadow-red-200"
                      }`}
                  >
                    {toast.message}
                  </div>
                )}

                {/* Profile Form Section */}
                <ProfileFormSection
                  form={profileUpdate.form}
                  errors={profileUpdate.errors}
                  imagePreview={profileUpdate.imagePreview}
                  onFieldChange={profileUpdate.updateField}
                  onImageSelect={profileUpdate.selectImage}
                />

                {/* Password Change Section */}
                <PasswordChangeSection
                  form={passwordChange.form}
                  errors={passwordChange.errors}
                  isLoading={passwordChange.isLoading}
                  onFieldChange={passwordChange.updateField}
                  onSubmit={handlePasswordSubmit}
                />
              </>
            ) : (
              // Purchase History Content
              <PurchaseHistorySection
                purchases={purchaseHistory.purchases}
                totalAmount={purchaseHistory.totalAmount}
                dateFilter={purchaseHistory.dateFilter}
                pagination={purchaseHistory.pagination}
                formatCurrency={purchaseHistory.formatCurrency}
                formatDate={purchaseHistory.formatDate}
                onDateFilterChange={purchaseHistory.updateDateFilter}
                isLoading={purchaseHistory.isLoading}
                onExport={handleExportCSV}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
