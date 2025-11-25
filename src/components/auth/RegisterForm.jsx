'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';

const RegisterForm = ({ onSuccess, onError }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer', // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
    // Clear role error when user selects a role
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validasi password match
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Password and confirm password do not match' });
      setIsLoading(false);
      return;
    }

    // Validasi role selection
    if (!formData.role) {
      setErrors({ role: 'Please select your role' });
      setIsLoading(false);
      return;
    }

    try {
      // Menggunakan API backend Laravel yang sebenarnya
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name.toLowerCase().replace(/\s+/g, ''),
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role: formData.role
        })
      });

      let data;
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        if (data && data.errors) {
          const newErrors = {};
          Object.keys(data.errors).forEach(key => {
            newErrors[key] = data.errors[key][0];
          });
          setErrors(newErrors);
          throw new Error('Please check the form for errors');
        }
        throw new Error((data && data.message) || 'Registration failed');
      }

      // Simpan token dan user data dari response backend
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        email: data.user.email,
        username: data.user.username,
        role: data.user.role
      }));
      
      onSuccess?.();
      router.push('/dashboard');
    } catch (error) {
      onError?.(error.message || 'Registration failed - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
          error={errors.name}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
          error={errors.password}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your mail address"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          error={errors.password_confirmation}
        />
      </div>

      <div className="mb-4">
        <Select
          label="Role"
          value={formData.role}
          onChange={handleRoleChange}
          options={[
            { value: 'customer', label: 'Customer (Buyer)' },
            { value: 'seller', label: 'Seller' },
          ]}
          placeholder="Select your role"
          required
          error={errors.role}
        />
      </div>

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;