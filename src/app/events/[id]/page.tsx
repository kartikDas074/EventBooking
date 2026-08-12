import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { getEventById } from '../../../lib/events';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white border border-zinc-200 p-8 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 shadow-sm">
            <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Event Not Found</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              The event you are looking for does not exist, has been deleted, or is not published yet.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(event.startDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedEndDate = new Date(event.endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedEndTime = new Date(event.endDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isSoldOut = event.availableSeats <= 0;
  const isFree = event.price === 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Discovery
          </Link>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Hero Area */}
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 aspect-[21/9] w-full">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500">
                  <span className="text-xl font-bold">EventHub Experience</span>
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  {event.category?.name || 'Event'}
                </span>
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {event.status}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {event.title}
              </h1>
            </div>

            {/* Description */}
            <div className="border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line text-base">
                {event.description}
              </p>
            </div>

            {/* Organizer Section */}
            <div className="border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80">
              <h2 className="text-xl font-bold mb-4">Event Organizer</h2>
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-zinc-200/80 dark:bg-zinc-950 dark:border-zinc-800">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                  {event.organizer?.name.charAt(0) || 'O'}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{event.organizer?.name || 'Organizer'}</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{event.organizer?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Sidebar Widget */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800/80 shadow-md">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">Ticket Price</span>
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {isFree ? 'Free' : `$${event.price.toFixed(2)}`}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-4 mb-6 text-sm">
                {/* Date & Time */}
                <div className="flex gap-3">
                  <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100">Date & Time</h5>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                      Starts: {formattedDate} at {formattedTime}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                      Ends: {formattedEndDate} at {formattedEndTime}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-3">
                  <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100">Location</h5>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{event.location}</p>
                  </div>
                </div>

                {/* Available Seats */}
                <div className="flex gap-3">
                  <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100">Availability</h5>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                      {isSoldOut ? (
                        <span className="text-rose-500 font-bold">Sold Out</span>
                      ) : (
                        `${event.availableSeats} of ${event.capacity} seats remaining`
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {isSoldOut ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 cursor-not-allowed border border-zinc-200 dark:border-zinc-800"
                >
                  Sold Out
                </button>
              ) : (
                <Link
                  href={`/booking/${event.id}`}
                  className="block w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 shadow-sm transition-colors"
                >
                  Book Tickets Now
                </Link>
              )}
              <p className="mt-2 text-center text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold">
                Instant confirmation with active seat reservation.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
