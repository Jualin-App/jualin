'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
        
        // Update localStorage with complete user data
        localStorage.setItem('user', JSON.stringify({
          email: userData.email,
          username: userData.username,
          role: userData.role
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If error, use localStorage data as fallback
        const localUserData = localStorage.getItem('user');
        if (localUserData) {
          setUser(JSON.parse(localUserData));
        }
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Call backend logout API
      await fetch('http://localhost:8000/api/v1/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear localStorage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.username || user.name || 'User'}!</h2>
            <p className="text-gray-600 mb-2">Email: {user.email}</p>
            <p className="text-gray-600 mb-2">Role: {user.role}</p>
            <p className="text-sm text-gray-500 mt-4">
              This is a mock dashboard for testing authentication flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}