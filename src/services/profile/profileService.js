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
   * @param {Object} profileData - Profile fields (fullName, email, phone, location, bio, profilePicture)
   * @param {File|null} imageFile - Profile picture file (optional)
   * @returns {Promise<Object>} Update response with success status and updated data
   */
  async updateProfile(profileData, imageFile = null) {
    try {
      let response;

      if (imageFile) {
        const formData = new FormData();
        formData.append('fullName', profileData.fullName);
        formData.append('email', profileData.email);
        formData.append('phone', profileData.phone || '');
        formData.append('location', profileData.location);
        formData.append('bio', profileData.bio || '');
        formData.append('profilePicture', imageFile);

        response = await apiClient.patch('/profile/update', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await apiClient.patch('/profile/update', {
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone || '',
          location: profileData.location,
          bio: profileData.bio || '',
          profilePicture: profileData.profilePicture || '',
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
