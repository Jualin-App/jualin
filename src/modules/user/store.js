import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import userService from './service';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      fetchProfile: async () => {
        console.log('fetchProfile called from store');
        set({ loading: true, error: null });
        try {
          const response = await userService.getProfile();
          console.log('fetchProfile response:', response);
           
           // Check if response contains error
           if (response && response.error) {
             console.log('API returned error, using mock data');
             // For development, use mock data if API fails
             const mockData = {
               name: 'Demo User',
               email: 'demo@example.com',
               phone: '(123) 456-7890',
               location: 'Jakarta',
               bio: 'Demo user profile for testing purposes.',
               avatar_url: 'https://via.placeholder.com/150'
             };
             set({ 
               profile: mockData,
               loading: false,
               error: null
             });
             return mockData;
           }
           
           const profileData = response.data || response;
           console.log('Setting profile data:', profileData);
           set({ 
             profile: profileData,
             loading: false,
             error: null
           });
           return profileData;
        } catch (error) {
          console.error('fetchProfile error:', error);
          set({ 
            loading: false,
            error: error.message 
          });
          throw error;
        }
      },

      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const response = await userService.updateProfile(profileData);
          set({ 
            profile: response.data,
            loading: false,
            error: null
          });
          return response.data;
        } catch (error) {
          set({ 
            loading: false,
            error: error.message 
          });
          throw error;
        }
      },

      uploadAvatar: async (file) => {
        set({ loading: true, error: null });
        try {
          const response = await userService.uploadAvatar(file);
          const currentProfile = get().profile;
          if (currentProfile) {
            set({
              profile: {
                ...currentProfile,
                avatar_url: response.data.avatar_url
              },
              loading: false,
              error: null
            });
          }
          return response.data;
        } catch (error) {
          set({ 
            loading: false,
            error: error.message 
          });
          throw error;
        }
      },

      changePassword: async (passwordData) => {
        set({ loading: true, error: null });
        try {
          const response = await userService.changePassword(passwordData);
          set({ 
            loading: false,
            error: null
          });
          return response.data;
        } catch (error) {
          set({ 
            loading: false,
            error: error.message 
          });
          throw error;
        }
      },

      resetUser: () => set({ 
        user: null,
        profile: null,
        loading: false,
        error: null
      }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user,
        profile: state.profile 
      }),
    }
  )
);

export default useUserStore;