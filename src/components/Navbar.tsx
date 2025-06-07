'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

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
          
          <div className="hidden mt-2 md:flex space-x-6">
            <Link
              href="/dashboard"
              className={`${
                pathname === '/dashboard'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/50'
              } transition-colors duration-200 h-full flex items-center text-md`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/knowledge-base"
              className={`${
                pathname === '/admin/knowledge-base'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/50'
              } transition-colors duration-200 h-full flex items-center text-md`}
            >
              Knowledge Base
            </Link>
          </div>

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
      </div>
    </nav>
  );
} 