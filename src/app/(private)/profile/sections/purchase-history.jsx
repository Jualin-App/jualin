"use client"

/**
 * PurchaseHistorySection
 * Purchase history display with date filter, summary, and pagination
 * Used in profile/edit/page.jsx
 */
export function PurchaseHistorySection({
  purchases,
  totalAmount,
  pagination,
  formatCurrency,
  isLoading,
  onExport,
  onRefresh
}) {
  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading purchases...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F1F1F] mb-4">
          Riwayat Pembelian
        </h1>
        <div className="flex items-center justify-between">
          <div />
          <div className="flex gap-4">
            <button
              onClick={onExport}
              className="group relative text-sm font-medium text-[#E53935] hover:text-[#D32F2F] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="relative">
                Export to CSV
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#E53935] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
            <button
              onClick={onRefresh}
              className="text-sm font-medium text-[#E53935] hover:text-[#D32F2F] transition-colors"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
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

      {/* Payment List */}
      {purchases && purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((payment) => (
            <div
              key={payment.order_id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[#1F1F1F] mb-1">
                    Order #{payment.order_id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.transaction_time).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#E53935]">
                    {formatCurrency(payment.gross_amount)}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${payment.transaction_status === 'settlement'
                      ? 'bg-green-100 text-green-700'
                      : payment.transaction_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                    {payment.transaction_status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No purchase history found
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
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
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pagination.currentPage === page
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
