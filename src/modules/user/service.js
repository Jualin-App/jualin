import { fetch } from '../../utils/baseFetch';

export const userService = {
  getProfile: async () => {
    try {
      console.log('Fetching user profile from /me...');
      const response = await fetch({
        url: '/me',
        method: 'GET'
      });
      console.log('Profile fetch response:', response);
      
      // Check if response is an error object
      if (response && response.error) {
        console.error('API returned error:', response.message);
        // Return mock data for development
        return {
          data: {
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '(123) 456-7890',
            location: 'Jakarta',
            bio: 'Demo user profile for testing purposes.',
            avatar_url: 'https://via.placeholder.com/150'
          }
        };
      }
      
      console.log('Profile fetch successful:', response);
      return response;
    } catch (error) {
      console.error('Profile fetch error:', error);
      console.error('Error details:', error.message, error.response?.data, error.response?.status);
      
      // For development/demo purposes, return mock data if API fails
      console.warn('API unavailable, returning mock data for development');
      return {
        data: {
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '(123) 456-7890',
          location: 'Jakarta',
          bio: 'Demo user profile for testing purposes.',
          avatar_url: 'https://via.placeholder.com/150'
        }
      };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await fetch({
        url: '/profile/update',
        method: 'PATCH',
        payload: profileData
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update user profile');
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch({
        url: '/profile/avatar',
        method: 'POST',
        payload: formData,
        options: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload avatar');
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await fetch({
        url: '/v1/profile/change-password',
        method: 'POST',
        payload: passwordData
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to change password');
    }
  }
};

export default userService;