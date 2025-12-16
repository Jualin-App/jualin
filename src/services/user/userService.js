import apiClient from '../api/client';
import { parseApiError } from '../api/errorHandler';

export const userService = {
  /**
   * Fetch user by ID
   * @param {number} id - User ID
   */
  async fetchById(id) {
    try {
      const response = await apiClient.get(`/api/v1/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw parseApiError(error);
    }
  },

  async fetchCurrentUser() {
    try {
      const response = await apiClient.get('/api/v1/users/me');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw parseApiError(error);
    }
  },
};

export default userService;
