import React from 'react';
import Link from 'next/link';
import { Event } from '../../lib/api';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(event.startDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate percentage of seats left
  const seatPercentage = (event.availableSeats / event.capacity) * 100;
  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-950">
      {/* Event Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500">
            <span className="font-bold text-sm">EventHub Experience</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90 dark:text-zinc-50">
            {event.category?.name || 'Event'}
          </span>
        </div>
        {event.price === 0 ? (
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              FREE
            </span>
          </div>
        ) : (
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm dark:bg-indigo-500">
              ${event.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formattedDate} • {formattedTime}</span>
        </div>

        <h3 className="mt-2 text-lg font-bold leading-6 text-zinc-900 line-clamp-1 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>

        <p className="mt-2 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">
          {event.description}
        </p>

        {/* Location */}
        <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* Capacity / Available Seats */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>Seats Available</span>
            <span className={isSoldOut ? 'text-rose-500 font-bold' : seatPercentage < 20 ? 'text-amber-500 font-bold' : ''}>
              {isSoldOut ? 'Sold Out' : `${event.availableSeats} / ${event.capacity}`}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isSoldOut ? 'bg-rose-500' : seatPercentage < 20 ? 'bg-amber-500' : 'bg-indigo-600 dark:bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, seatPercentage))}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            href={`/events/${event.id}`}
            className="flex w-full items-center justify-center rounded-xl bg-zinc-50 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 hover:text-indigo-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-indigo-400 border border-zinc-100 dark:border-zinc-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
