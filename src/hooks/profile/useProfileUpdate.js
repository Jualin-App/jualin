import { useState, useMemo, useEffect } from 'react';
import { profileService } from '@/services';
import { useAuth } from '@/context/AuthProvider';
import { getProfilePictureUrl } from '@/utils/imageHelper';

/**
 * Hook to manage profile update form and submission
 * @returns {Object} { form, imageFile, imagePreview, errors, isLoading, updateField, selectImage, submit }
 */
export const useProfileUpdate = () => {
  const { user, setUser } = useAuth();

  // Initialize form state from user context
  const initialForm = useMemo(
    () => ({
      username: user?.username || '',
      email: user?.email || '',
      gender: user?.gender || 'male',
      birthday: user?.birthday || '',
      region: user?.region || '',
      city: user?.city || '',
      bio: user?.bio || '',
      profile_picture: user?.profile_picture || user?.profilePicture || '',
    }),
    [user]
  );

  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    getProfilePictureUrl(initialForm.profile_picture)
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update form when user changes
  useEffect(() => {
    setForm(initialForm);
    // Convert relative path to full URL for image preview
    setImagePreview(getProfilePictureUrl(initialForm.profile_picture));
  }, [initialForm]);

  /**
   * Update a form field
   * @param {string} key - Field name
   * @param {string} value - Field value
   */
  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  /**
   * Handle image selection
   * @param {File} file - Image file
   * @param {string} previewUrl - Preview URL
   */
  const selectImage = (file, previewUrl) => {
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  /**
   * Validate profile form
   * @returns {boolean} True if valid
   */
  const validate = () => {
    const e = {};
    if (!form.username?.trim()) e.username = 'Username required';
    if (!form.email?.trim() || !/.+@.+\..+/.test(form.email)) e.email = 'Valid email required';
    if (form.bio?.length > 500) e.bio = 'Bio max 500 chars';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /**
   * Submit profile update
   * @returns {Promise<Object>} { success, data, message }
   */
  const submit = async () => {
    if (!validate()) return { success: false };

    setIsLoading(true);
    try {
      const result = await profileService.updateProfile(form, imageFile);

      if (result?.success) {
        // Update user context and localStorage
        const updatedUser = result.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return { success: true, data: updatedUser, message: result.message };
      } else {
        return { success: false, message: result?.message || 'Failed to update' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Unexpected error' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    imageFile,
    imagePreview,
    errors,
    isLoading,
    updateField,
    selectImage,
    submit,
  };
};

export default useProfileUpdate;
