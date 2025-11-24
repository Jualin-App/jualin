# User Service Module

Service user profile yang sudah dibuat dengan baseFetch dan clean code.

## 📁 Struktur File

```
src/modules/user/
├── service.js    → API service dengan baseFetch
├── store.js      → State management dengan Zustand  
├── utils.js      → Helper functions
└── index.js      → Export aggregator
```

## 🚀 Fitur

### Service (service.js)
- ✅ `getProfile()` - Fetch data user (GET /v1/me)
- ✅ `updateProfile()` - Update user profile (PATCH /v1/profile/update)
- ✅ `uploadAvatar()` - Upload avatar user
- ✅ `changePassword()` - Ganti password user

### Store (store.js)
- ✅ State management dengan Zustand
- ✅ Persist data ke localStorage
- ✅ Loading dan error state
- ✅ Actions untuk semua operasi

### Utils (utils.js)
- ✅ Validasi form profile
- ✅ Validasi email & password
- ✅ Format data profile
- ✅ Helper functions

## 💻 Cara Penggunaan

```javascript
// Import service
import { userService, useUserStore } from '@/modules/user';

// Di component React
const { profile, loading, error, fetchProfile, updateProfile } = useUserStore();

// Fetch profile
const handleFetchProfile = async () => {
  try {
    await fetchProfile();
    console.log('Profile:', profile);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Update profile
const handleUpdateProfile = async (data) => {
  try {
    await updateProfile(data);
    console.log('Profile updated!');
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

## ✅ Status

- ✅ Service user module sudah dibuat
- ✅ Clean code tanpa komen berlebihan
- ✅ Menggunakan baseFetch untuk API calls
- ✅ State management dengan Zustand
- ✅ Halaman edit profile sudah diupdate dengan fitur submit
- ✅ Demo halaman test service berhasil

Service ini siap digunakan untuk implementasi fitur user profile di aplikasi!