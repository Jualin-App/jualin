import apiClient from '../api/client';
import { parseApiError } from '../api/errorHandler';

/**
 * Profile Service
 * Handles all profile-related API operations
 */
export const profileService = {
  /**
   * Fetch current user profile
   * @returns {Promise<Object>} User profile data
   */
  async fetchCurrentProfile() {
    try {
      const response = await apiClient.get('/api/v1/me');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw parseApiError(error);
    }
  },

  /**
   * Update user profile with optional profile picture
   * @param {Object} profileData - Profile fields (username, email, gender, birthday, region, city, bio, profile_picture)
   * @param {File|null} imageFile - Profile picture file (optional)
   * @returns {Promise<Object>} Update response with success status and updated data
   */
  async updateProfile(profileData, imageFile = null) {
    try {
      // Get user ID from localStorage
      const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
      const userId = storedUser?.id;

      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      let response;

      if (imageFile) {
        // With image upload - use FormData with POST method
        const formData = new FormData();
        formData.append('username', profileData.username);
        formData.append('email', profileData.email);
        formData.append('gender', profileData.gender || 'male');
        formData.append('birthday', profileData.birthday || '');
        formData.append('region', profileData.region || '');
        formData.append('city', profileData.city || '');
        formData.append('bio', profileData.bio || '');
        formData.append('profile_picture', imageFile);

        response = await apiClient.post(`/api/v1/users/${userId}/update?_method=PATCH`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Without image - use JSON with POST method
        response = await apiClient.post(`/api/v1/users/${userId}/update?_method=PATCH`, {
          username: profileData.username,
          email: profileData.email,
          gender: profileData.gender || 'male',
          birthday: profileData.birthday || '',
          region: profileData.region || '',
          city: profileData.city || '',
          bio: profileData.bio || '',
        });
      }

      const result = response?.data ?? response;
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw parseApiError(error);
    }
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Update response with success status
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.patch('/profile/change-password', {
        currentPassword,
        newPassword
      });
      return response?.data ?? response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw parseApiError(error);
    }
  },
};

export default profileService;
