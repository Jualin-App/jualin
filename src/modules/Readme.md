# Folder: modules/

Berisi logika inti berdasarkan fitur (feature-based architecture).

## auth/
- services.js → Tempat memanggil API ke backend (login, register, logout).
- store.js → Tempat menyimpan state user (Zustand / Context).
- utils.js → Helper seperti cek token, simpan token ke localStorage.

## Kelebihan:
- Mudah scaling ketika nambah fitur:
  modules/product/
  modules/cart/
  modules/forum/
