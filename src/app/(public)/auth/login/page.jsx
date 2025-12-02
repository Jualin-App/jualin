'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LoginForm from '../../../../components/auth/LoginForm';
import Logo from '../../../../components/ui/Logo';
import Button from '../../../../components/ui/Button';
import Toast from '../../../../components/ui/Toast';

export default function LoginPage() {
  const [toast, setToast] = useState(null);

  const handleSuccess = () => {
    setToast({ message: 'Login successful! Redirecting...', type: 'success' });
  };

  const handleError = (error) => {
    setToast({ message: error, type: 'error' });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background paint splashes */}
      <div className="absolute top-0 -left-48 w-96 h-96 bg-[#E83030] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 -right-48 w-96 h-96 bg-[#E83030] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <Logo size="xl" className="mb-6" />

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome back !
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Enter to get second best price!
            </p>
          </div>

          <LoginForm onSuccess={handleSuccess} onError={handleError} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or, Login with</span>
            </div>
          </div>

          <Button variant="google">
            Sign up with Google
          </Button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#E83030] hover:text-red-600 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}