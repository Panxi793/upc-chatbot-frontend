'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          UPC Chatbot
        </Link>
        <div className="space-x-4">
          <Link
            href="/dashboard"
            className={`hover:text-gray-300 ${
              pathname === '/dashboard' ? 'text-indigo-400' : ''
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/knowledge-base"
            className={`hover:text-gray-300 ${
              pathname === '/admin/knowledge-base' ? 'text-indigo-400' : ''
            }`}
          >
            Knowledge Base
          </Link>
          <Link
            href="/admin/documents"
            className={`hover:text-gray-300 ${
              pathname === '/admin/documents' ? 'text-indigo-400' : ''
            }`}
          >
            Documents
          </Link>
          <button
            onClick={() => {
              // TODO: Implement logout logic
              window.location.href = '/login';
            }}
            className="hover:text-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
} 