/**
 * Mock Purchase History Data
 * TODO: Remove this file when backend purchase history API is ready
 */

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
];

/**
 * Get mock purchases with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.startDate - Filter start date (optional)
 * @param {string} params.endDate - Filter end date (optional)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Object} { data, pagination, totalAmount }
 */
export const getMockPurchases = (params = {}) => {
  const { startDate, endDate, page = 1, limit = 10 } = params;

  // Filter by date range
  let filtered = MOCK_TRANSACTIONS;
  if (startDate || endDate) {
    filtered = MOCK_TRANSACTIONS.filter(t => {
      const tDate = new Date(t.date);
      if (startDate && tDate < new Date(startDate)) return false;
      if (endDate && tDate > new Date(endDate)) return false;
      return true;
    });
  }

  // Paginate
  const start = (page - 1) * limit;
  const paginatedData = filtered.slice(start, start + limit);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit)
    },
    totalAmount: filtered.reduce((sum, t) => sum + t.amount, 0)
  };
};
