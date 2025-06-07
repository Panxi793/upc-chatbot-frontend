'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-up-maroon shadow-lg">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center">
            <div className="flex items-center">
              <div className="relative w-20 h-20 flex items-center">
                <Image
                  src="/uplogos.png"
                  alt="UP Cebu Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-white text-xl font-bold ml-2">UPC Chatbot</span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            <Link
              href="/dashboard"
              className={`${
                pathname === '/dashboard'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/50'
              } transition-colors duration-200 h-full flex mt-2 items-center text-md`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            {user?.username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && (
              <Link
                href="/admin/knowledge-base"
                className={`${
                  pathname === '/admin/knowledge-base'
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/50'
                } transition-colors duration-200 h-full flex mt-2 items-center text-md`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Knowledge Base
              </Link>
            )}
            <div className="flex items-center">
              <button
                onClick={() => {
                  // TODO: Implement logout logic
                  window.location.href = '/login';
                }}
                className="text-white/90 hover:text-white transition-colors duration-200 px-4 py-1 rounded-md border-2 border-white/30 hover:border-white/60 text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Hamburger for Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-white focus:outline-none"
              aria-label="Open menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-up-maroon px-4 py-2 rounded-b-lg shadow-lg absolute left-0 right-0 z-50">
            <Link
              href="/dashboard"
              className={`block py-2 text-white font-medium ${pathname === '/dashboard' ? 'border-b-2 border-white' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            {user?.username === 'admin' && (
              <Link
                href="/admin/knowledge-base"
                className={`block py-2 text-white font-medium ${pathname === '/admin/knowledge-base' ? 'border-b-2 border-white' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Knowledge Base
              </Link>
            )}
            <div className="flex mt-2 items-center">
              <button
                onClick={() => {
                  // TODO: Implement logout logic
                  window.location.href = '/login';
                }}
                className="text-white/90 hover:text-white transition-colors duration-200 px-4 py-1 rounded-md border-2 border-white/30 hover:border-white/60 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 