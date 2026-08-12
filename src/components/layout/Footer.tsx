import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100 py-10 dark:bg-black dark:border-zinc-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EventHub
            </span>
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500 max-w-xs">
              Discover and book the best events near you. Technology, Business, Music, Sports and more.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-xs uppercase tracking-wide">Explore</p>
              <Link href="/events" className="block text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Events</Link>
              <Link href="/#categories" className="block text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Categories</Link>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-xs uppercase tracking-wide">Account</p>
              <Link href="/login" className="block text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Login</Link>
              <Link href="/register" className="block text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Register</Link>
              <Link href="/dashboard" className="block text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-400 dark:text-zinc-600 font-medium">
          © 2026 EventHub Inc. All rights reserved. Built with Next.js &amp; Express.
        </div>
      </div>
    </footer>
  );
}
