'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authApi.login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-gray-50">
      <div className="absolute inset-0 w-full h-full z-0">
        <img src="/upc_image.webp" alt="UP Oblation" className="w-full h-full object-cover object-center opacity-5" />
      </div>
      <div className="max-w-md w-full space-y-8 p-4 sm:p-8 bg-white bg-opacity-90 rounded-lg shadow-lg z-10">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-up-maroon">
            UPC Chatbot
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-up-gray-600">
            Please sign in to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-xs whitespace-pre-line">
            {error}
          </div>
        )}

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-up-gray-300 placeholder-up-gray-500 text-up-gray-900 rounded-t-md focus:outline-none focus:ring-up-maroon focus:border-up-maroon focus:z-10 text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-up-gray-300 placeholder-up-gray-500 text-up-gray-900 rounded-b-md focus:outline-none focus:ring-up-maroon focus:border-up-maroon focus:z-10 text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-up-maroon hover:bg-up-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-up-maroon ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-up-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-up-maroon hover:text-up-maroon-dark">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 