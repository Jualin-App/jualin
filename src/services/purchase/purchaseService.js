import apiClient from '../api/client';
import { parseApiError } from '../api/errorHandler';
import { getMockPurchases } from '../utils/mockPurchases';

/**
 * Purchase Service
 * Handles purchase history operations
 * Currently uses mock data, ready for backend integration
 */
export const purchaseService = {
  /**
   * Fetch user's purchase history
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Filter start date (optional)
   * @param {string} params.endDate - Filter end date (optional)
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @returns {Promise<Object>} { data, pagination, totalAmount }
   */
  async fetchPurchaseHistory(params = {}) {
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await apiClient.get('/api/v1/purchases', { params });
      // return response.data.data || response.data;

      // Temporary: Return mock data
      const result = getMockPurchases(params);
      return result;
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      throw parseApiError(error);
    }
  },

  /**
   * Export purchases to CSV
   * @param {Object} params - Filter parameters
   * @returns {Promise<Blob>} CSV file blob
   */
  async exportToCSV(params = {}) {
    try {
      // TODO: Implement when backend provides export endpoint
      // const response = await apiClient.get('/api/v1/purchases/export', {
      //   params,
      //   responseType: 'blob'
      // });
      // return response.data;
      throw new Error('Export feature not yet implemented');
    } catch (error) {
      console.error('Error exporting purchases:', error);
      throw parseApiError(error);
    }
  },
};

export default purchaseService;
