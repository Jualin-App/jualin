"use client"

/**
 * PurchaseHistorySection
 * Purchase history display with date filter, summary, and pagination
 * Used in profile/edit/page.jsx
 */
export function PurchaseHistorySection({
  purchases,
  totalAmount,
  dateFilter,
  pagination,
  formatCurrency,
  formatDate,
  onDateFilterChange,
  isLoading
}) {
  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading purchases...</div>;
  }

  return (
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
              onChange={(e) => onDateFilterChange("start", e.target.value)}
              className="text-sm text-[#1F1F1F] outline-none"
            />
            <span className="text-gray-400">–</span>
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) => onDateFilterChange("end", e.target.value)}
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
        {purchases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No purchases found</div>
        ) : (
          purchases.map((transaction) => (
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
          ))
        )}
      </div>

      {/* Pagination */}
      {purchases.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
              disabled={!pagination.hasPrevPage}
              onClick={pagination.prevPage}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}

            <button
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
              disabled={!pagination.hasNextPage}
              onClick={pagination.nextPage}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show per page</span>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => pagination.changeItemsPerPage(Number(e.target.value))}
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
