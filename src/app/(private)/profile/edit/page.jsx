'use client';
import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({ name: '', email: '', username: '' });

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/v1/me');
        if (!mounted) return;
        const data = res.data;
        setProfile({
          name: data.name || '',
          email: data.email || '',
          username: data.username || '',
        });
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Gagal mengambil data user');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMe();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        {loading && <p className="text-gray-600">Memuat data...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {!loading && !error && (
          <form className="space-y-4">
            <Input
              label="Nama"
              type="text"
              name="name"
              placeholder="Nama lengkap"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Username"
              value={profile.username}
              onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
              required
            />
            <Button type="button" variant="primary" onClick={() => {}}>
              Simpan Perubahan
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}