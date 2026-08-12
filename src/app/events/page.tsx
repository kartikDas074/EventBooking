import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import EventCard from '../../components/events/EventCard';
import HeroSearch from '../../components/events/HeroSearch';
import { getEvents } from '../../lib/events';
import { getCategories } from '../../lib/categories';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ExploreEventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const category = params.category || '';
  const location = params.location || '';
  const sort = params.sort || 'date_asc';
  const page = parseInt(params.page || '1', 10);

  // Fetch data
  const categories = await getCategories();
  const paginatedData = await getEvents({
    search,
    category,
    location,
    sort,
    page,
    limit: 12,
  });

  const events = paginatedData?.data || [];
  const meta = paginatedData?.meta || { page: 1, limit: 12, total: 0, totalPages: 1 };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Explore Events</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Search, filter, and sort through the latest local workshops, meetups, and conferences.
          </p>
        </div>

        {/* Filters Panel & Search */}
        <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
          <HeroSearch />

          {/* Sorting and Category Badges */}
          <div className="flex flex-wrap gap-4 items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-900">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-zinc-400 mr-2">Categories:</span>
              <Link
                href="/events"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  !category
                    ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300'
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/events?category=${cat.name}&search=${search}&location=${location}&sort=${sort}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    category === cat.name
                      ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Sorting Selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">Sort By:</span>
              <div className="flex bg-zinc-100 rounded-full p-1 dark:bg-zinc-900 text-xs font-semibold">
                <Link
                  href={`/events?sort=date_asc&category=${category}&search=${search}&location=${location}`}
                  className={`px-3 py-1 rounded-full ${sort === 'date_asc' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500'}`}
                >
                  Nearest
                </Link>
                <Link
                  href={`/events?sort=price_asc&category=${category}&search=${search}&location=${location}`}
                  className={`px-3 py-1 rounded-full ${sort === 'price_asc' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500'}`}
                >
                  Price Low
                </Link>
                <Link
                  href={`/events?sort=price_desc&category=${category}&search=${search}&location=${location}`}
                  className={`px-3 py-1 rounded-full ${sort === 'price_desc' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500'}`}
                >
                  Price High
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-zinc-200 p-8 rounded-3xl dark:bg-zinc-950 dark:border-zinc-900 max-w-lg mx-auto">
            <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">No events found</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              We couldn't find any events matching your selected criteria. Try adjusting filters or search term.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Reset Filters
            </Link>
          </div>
        )}

        {/* Pagination Controls */}
        {meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <Link
              href={`/events?page=${Math.max(1, page - 1)}&category=${category}&search=${search}&location=${location}&sort=${sort}`}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                page === 1
                  ? 'border-zinc-200 text-zinc-300 pointer-events-none dark:border-zinc-800'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900'
              }`}
            >
              Previous
            </Link>
            <span className="text-xs font-bold text-zinc-400 px-4">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Link
              href={`/events?page=${Math.min(meta.totalPages, page + 1)}&category=${category}&search=${search}&location=${location}&sort=${sort}`}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                page === meta.totalPages
                  ? 'border-zinc-200 text-zinc-300 pointer-events-none dark:border-zinc-800'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900'
              }`}
            >
              Next
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
