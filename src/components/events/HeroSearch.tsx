'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    if (locationTerm.trim()) {
      params.append('location', locationTerm.trim());
    }
    const queryString = params.toString();
    router.push(queryString ? `/events?${queryString}` : '/events');
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl bg-white border border-zinc-200/80 p-3 rounded-2xl md:rounded-full shadow-lg dark:bg-zinc-950 dark:border-zinc-800 flex flex-col md:flex-row gap-3 items-center"
    >
      <div className="flex-1 w-full flex items-center gap-3 px-3">
        <svg className="h-5 w-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search events, topics, keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 text-sm py-2"
        />
      </div>

      <div className="h-px w-full md:h-8 md:w-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="flex-1 w-full flex items-center gap-3 px-3">
        <svg className="h-5 w-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          placeholder="Location (e.g. Dhaka, Online)..."
          value={locationTerm}
          onChange={(e) => setLocationTerm(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 text-sm py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-7 py-3 rounded-xl md:rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors duration-200 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
      >
        Find Events
      </button>
    </form>
  );
}

export default function HeroSearch() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-4xl bg-white border border-zinc-200 p-4 rounded-full text-center text-xs text-zinc-400">
        Loading search bar...
      </div>
    }>
      <SearchFormContent />
    </Suspense>
  );
}
