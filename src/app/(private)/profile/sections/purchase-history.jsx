"use client";

import React, { useState } from "react";
import Toast from "@/components/ui/Toast";
import usePaymentHistory from "@/hooks/payments/usePaymentHistory";
import useMidtransSnap from "@/hooks/payments/useMidtransSnap";
import { paymentService } from "@/services/payment/paymentService";
import PaymentHistoryList from "@/components/profile/PaymentHistoryList";

export function PurchaseHistorySection() {
  const {
    paginated,
    isLoading,
    totalAmount,
    pagination,
    refetch,
    formatCurrency,
  } = usePaymentHistory();

  const { loaded, openSnap } = useMidtransSnap();
  const [toast, setToast] = useState(null);
  const [isContinuing, setIsContinuing] = useState(false);

  const handleItemClick = async (p) => {
    const status = String(p?.transaction_status || "").toLowerCase();
    if (status !== "pending") {
      setToast({ type: "info", message: "Transaksi tidak berstatus pending" });
      return;
    }

    const callbacks = {
      onSuccess: () =>
        setToast({ type: "success", message: "Pembayaran berhasil" }),
      onPending: () =>
        setToast({ type: "info", message: "Pembayaran tertunda" }),
      onError: () => setToast({ type: "error", message: "Pembayaran gagal" }),
      onClose: () => setToast({ type: "info", message: "Pembayaran ditutup" }),
    };

    try {
      setIsContinuing(true);

      if (loaded && (p?.snap_token || p?.snap_url)) {
        openSnap(p.snap_token, p.snap_url, callbacks);
        return;
      }

      if (p?.payment_id) {
        const reissued = await paymentService.reissueToken(p.payment_id);
        if (loaded && (reissued?.snap_token || reissued?.snap_url)) {
          openSnap(reissued.snap_token, reissued.snap_url, callbacks);
          return;
        }
      }

      setToast({
        type: "error",
        message: "Token pembayaran tidak tersedia dari riwayat.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err.message || "Gagal membuka pembayaran",
      });
    } finally {
      setIsContinuing(false);
    }
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F1F1F] mb-4">
          Riwayat Pembelian
        </h1>
        <div className="flex items-center justify-between">
          <div />
          <div className="flex gap-4">
            <button
              onClick={() => refetch()}
              className="text-sm font-medium text-[#E53935] hover:text-[#D32F2F] transition-colors"
            >
              {isLoading || isContinuing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Total card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
        <h2 className="text-3xl font-bold text-[#1F1F1F]">
          {formatCurrency(totalAmount)}
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">
          Loading payments...
        </div>
      ) : (
        <PaymentHistoryList
          items={paginated}
          formatCurrency={formatCurrency}
          onItemClick={handleItemClick}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
              disabled={pagination.currentPage <= 1}
              onClick={pagination.prev}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => pagination.goToPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    pagination.currentPage === page
                      ? "bg-[#E53935] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={pagination.next}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show per page</span>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) =>
                pagination.setItemsPerPage(Number(e.target.value))
              }
              className="text-sm border-none bg-transparent font-medium text-[#1F1F1F] outline-none cursor-pointer hover:text-[#E53935]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseHistorySection;
