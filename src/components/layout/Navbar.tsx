'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser, logout, isAuthenticated } from '../../lib/auth';
import type { User } from '../../types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setUser(getCurrentUser());
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 dark:bg-zinc-950/90 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                E
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                EventHub
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex sm:space-x-6 text-sm font-semibold">
              <Link
                href="/"
                className={`px-3 py-2 rounded-full transition-colors ${
                  pathname === '/'
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                Home
              </Link>
              <Link
                href="/events"
                className={`px-3 py-2 rounded-full transition-colors ${
                  pathname === '/events'
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                Explore Events
              </Link>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            {isAuth && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/50 hover:bg-indigo-100 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.5 rounded-md">
                    {user.role}
                  </span>
                </Link>

                <Link
                  href="/dashboard"
                  className="text-xs font-bold px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => logout()}
                  className="text-xs font-bold px-3 py-1.5 rounded-full text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-bold px-4 py-2 text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden border-b border-zinc-100 dark:border-zinc-800 p-4 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Explore Events
          </Link>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            {isAuth && user ? (
              <>
                <div className="px-3 py-1 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  Signed in as {user.name} ({user.role})
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="block w-full text-center py-2 bg-rose-50 text-rose-600 font-bold rounded-xl text-xs dark:bg-rose-950/40 dark:text-rose-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 border border-zinc-200 dark:border-zinc-800 font-bold rounded-xl text-xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
