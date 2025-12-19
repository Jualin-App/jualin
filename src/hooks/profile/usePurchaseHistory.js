import { useState, useEffect, useMemo } from 'react';
import { purchaseService } from '@/services';
import { usePagination } from '../common/usePagination';

/**
 * Hook to manage purchase history with filtering and pagination
 * @returns {Object} { purchases, allPurchases, isLoading, error, totalAmount, dateFilter, updateDateFilter, pagination, formatCurrency, formatDate, refetch }
 */
export const usePurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    start: '2025-01-01',
    end: '2025-10-03'
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /**
   * Fetch purchases from service
   */
  const fetchPurchases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await purchaseService.fetchPurchaseHistory({
        startDate: dateFilter.start,
        endDate: dateFilter.end,
        limit: 100 // Fetch all for client-side pagination
      });
      setPurchases(result.data || []);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch purchases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchPurchases();
  }, [dateFilter.start, dateFilter.end]);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return purchases.reduce((acc, curr) => acc + curr.amount, 0);
  }, [purchases]);

  // Pagination
  const pagination = usePagination(purchases, {
    initialPerPage: itemsPerPage
  });

  /**
   * Update items per page
   * @param {number} newValue - New items per page value
   */
  const changeItemsPerPage = (newValue) => {
    setItemsPerPage(newValue);
    pagination.changePerPage(newValue);
  };

  /**
   * Update date filter
   * @param {string} key - Filter key ('start' or 'end')
   * @param {string} value - Date value
   */
  const updateDateFilter = (key, value) => {
    setDateFilter(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Format currency to IDR
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Format date to readable format
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return {
    purchases: pagination.paginatedItems,
    allPurchases: purchases,
    isLoading,
    error,
    totalAmount,
    dateFilter,
    updateDateFilter,
    pagination: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      itemsPerPage,
      goToPage: pagination.goToPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      changeItemsPerPage,
    },
    formatCurrency,
    formatDate,
    refetch: fetchPurchases,
  };
};

export default usePurchaseHistory;
