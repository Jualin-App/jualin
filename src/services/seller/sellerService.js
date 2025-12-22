import apiClient from '../api/client';
import { parseApiError } from '../api/errorHandler';
import { orderService } from './orderService';

export const sellerService = {
  /**
   * Fetch products for a specific seller
   * @param {number} sellerId - Seller ID
   * @param {number} limit - Maximum number of products to fetch
   */
  async fetchProducts(sellerId, limit = 6) {
    try {
      const response = await apiClient.get('/api/v1/products', {
        params: {
          seller_id: sellerId,
          per_page: limit,
          sort_by: 'created_at',
          sort_dir: 'desc',
        },
      });

      const payload = response.data;

      // Handle new pagination structure from ProductController@index
      if (payload && Array.isArray(payload.products)) {
        return payload.products;
      }

      // Legacy structure fallback (just in case)
      if (payload?.data && Array.isArray(payload.data)) {
        return payload.data;
      }

      if (Array.isArray(payload)) {
        return payload;
      }

      return [];
    } catch (error) {
      console.error('Error fetching seller products:', error);
      throw parseApiError(error);
    }
  },

  /**
   * Fetch seller statistics (computed from orders)
   * @param {number} sellerId - Seller ID
   * @param {string} period - Period for stats ('daily', 'weekly', 'monthly')
   */
  async fetchStats(sellerId, period = 'daily') {
    try {
      const orders = await orderService.fetchSellerOrders({
        sellerId,
        status: 'all',
        limit: 100,
      });

      const totalIncome = orders.reduce(
        (sum, order) => sum + (Number(order.total_amount) || 0),
        0
      );

      return {
        period,
        totalIncome,
      };
    } catch (error) {
      console.error('Error computing seller stats:', error);
      throw parseApiError(error);
    }
  },

  /**
   * Update product details
   * @param {number} productId - Product ID to update
   * @param {Object} payload - Product data to update
   */
  async updateProduct(productId, payload) {
    try {
      const response = await apiClient.put(`/api/v1/products/${productId}`, payload);
      return response.data?.data ?? null;
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      return null;
    }
  },

  /**
   * Delete a product
   * @param {number} productId - Product ID to delete
   */
  async deleteProduct(productId) {
    try {
      const response = await apiClient.delete(`/api/v1/products/${productId}`);
      return response.status === 200 || response.status === 204;
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      return false;
    }
  },
};

export default sellerService;
