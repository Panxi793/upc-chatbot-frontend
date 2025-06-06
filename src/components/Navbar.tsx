'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-up-maroon shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <span className="text-white text-xl font-bold">UPC Chatbot</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link
              href="/dashboard"
              className={`${
                pathname === '/dashboard'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/80 hover:text-white hover:border-b-2 hover:border-white/50'
              } transition-colors duration-200 h-16 flex items-center`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/knowledge-base"
              className={`${
                pathname === '/admin/knowledge-base'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/80 hover:text-white hover:border-b-2 hover:border-white/50'
              } transition-colors duration-200 h-16 flex items-center`}
            >
              Knowledge Base
            </Link>
            <Link
              href="/admin/documents"
              className={`${
                pathname === '/admin/documents'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/80 hover:text-white hover:border-b-2 hover:border-white/50'
              } transition-colors duration-200 h-16 flex items-center`}
            >
              Documents
            </Link>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => {
                // TODO: Implement logout logic
                window.location.href = '/login';
              }}
              className="text-white/80 hover:text-white transition-colors duration-200 px-4 py-2 rounded-md border border-white/20 hover:border-white/40"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 