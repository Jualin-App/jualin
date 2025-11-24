export const formatProfileData = (profile) => {
  if (!profile) return null;

  return {
    ...profile,
    displayName: profile.name || profile.username || 'User',
    initials: getInitials(profile.name || profile.username || ''),
    joinedDate: profile.created_at ? formatDate(profile.created_at) : null,
    lastActive: profile.updated_at ? formatDate(profile.updated_at) : null,
  };
};

export const getInitials = (name) => {
  if (!name) return 'U';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const validateProfileData = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Nama minimal 2 karakter';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Email tidak valid';
  }

  if (!data.username || data.username.trim().length < 3) {
    errors.username = 'Username minimal 3 karakter';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePasswordChange = (data) => {
  const errors = {};

  if (!data.current_password) {
    errors.current_password = 'Password saat ini wajib diisi';
  }

  if (!data.new_password || data.new_password.length < 8) {
    errors.new_password = 'Password baru minimal 8 karakter';
  }

  if (data.new_password !== data.new_password_confirmation) {
    errors.new_password_confirmation = 'Konfirmasi password tidak cocok';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAvatarFile = (file) => {
  const errors = {};
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 2 * 1024 * 1024;

  if (!file) {
    errors.file = 'File wajib dipilih';
    return { isValid: false, errors };
  }

  if (!validTypes.includes(file.type)) {
    errors.file = 'Format file tidak valid. Gunakan JPG, PNG, atau WebP';
  }

  if (file.size > maxSize) {
    errors.file = 'Ukuran file maksimal 2MB';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const createProfileFormData = (profileData) => {
  const formData = new FormData();
  
  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== null && profileData[key] !== undefined) {
      formData.append(key, profileData[key]);
    }
  });

  return formData;
};