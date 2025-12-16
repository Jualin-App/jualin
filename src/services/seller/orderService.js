import apiClient from '../api/client';
import { parseApiError } from '../api/errorHandler';

export const orderService = {
  /**
   * Fetch seller orders with filters
   * @param {Object} params - Query parameters
   * @param {number} params.sellerId - Seller ID (optional, backend will filter by logged-in user)
   * @param {string} params.status - Order status filter ('all' or specific status)
   * @param {number} params.limit - Number of orders to fetch
   */
  async fetchSellerOrders(params = {}) {
    const { sellerId, status = 'all', limit = 10 } = params;

    try {
      const response = await apiClient.get('/api/v1/transactions', {
        params: {
          per_page: limit,
          status: status === 'all' ? undefined : status,
        },
      });

      const payload = response.data?.data;

      if (payload && Array.isArray(payload.data)) {
        return payload.data;
      }
      
      if (Array.isArray(payload)) {
        return payload;
      }

      return [];
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      throw parseApiError(error);
    }
  },

  /**
   * Verify order status
   * @param {number} orderId - Order ID to verify
   */
  async verifyOrder(orderId) {
    try {
      const response = await apiClient.post(`/api/v1/transactions/${orderId}`, {
        status: 'verified',
      });
      return !!response.data?.success;
    } catch (error) {
      console.error(`Error verifying order ${orderId}:`, error);
      return false;
    }
  },
};

export default orderService;
