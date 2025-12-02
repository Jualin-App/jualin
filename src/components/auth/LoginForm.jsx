'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Cookies from 'js-cookie';

const LoginForm = ({ onSuccess, onError }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        // Ambil pesan error dari backend, bisa dari data.message atau data.error
        const errorMsg =
          data.message ||
          (data.errors && Object.values(data.errors).flat().join(', ')) ||
          'Login failed';
        throw new Error(errorMsg);
      }

      localStorage.setItem('token', data.data.access_token);
      const role = String(data.data.role || 'customer').toLowerCase();
      localStorage.setItem('user', JSON.stringify({
        email: data.data.email,
        username: data.data.username,
        role
      }));
      Cookies.set('role', role, { sameSite: 'lax' });
      Cookies.set('token', data.data.access_token, { sameSite: 'lax' });

      onSuccess?.();
      router.push(role === 'seller' ? '/seller/dashboard' : '/dashboard');
    } catch (error) {
      onError?.(error.message || 'Login failed - please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Enter your mail address"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-[#E83030] focus:ring-[#E83030] border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <a href="#" className="text-sm text-[#E83030] hover:text-red-600 font-medium">
          Forgot your password?
        </a>
      </div>

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
};

export default LoginForm;
