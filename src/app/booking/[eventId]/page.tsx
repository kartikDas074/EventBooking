'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import { getEventById } from '../../../lib/events';
import { createBooking, Booking } from '../../../lib/bookings';
import { isAuthenticated, getDecodedTokenPayload } from '../../../lib/auth';
import { Event } from '../../../lib/api';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default function BookingCheckoutPage({ params }: PageProps) {
  const router = useRouter();
  const { eventId } = use(params);

  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Authenticate user check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/login?redirect=/booking/${eventId}`);
      return;
    }

    const loadEvent = async () => {
      try {
        const data = await getEventById(eventId);
        if (!data) {
          setError('Event not found.');
        } else {
          setEvent(data);
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <span className="text-zinc-500 font-semibold animate-pulse text-sm">Loading ticket parameters...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white border border-zinc-200 p-8 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 shadow-sm">
            <h2 className="text-xl font-bold text-rose-500">Checkout Error</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{error || 'Could not find requested event.'}</p>
            <Link href="/" className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-bold shadow-sm">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await createBooking(event.id, quantity);
      if (res.success) {
        setSuccessBooking(res.data);
      } else {
        setError(res.message || 'Failed to place booking.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const ticketPrice = event.price;
  const totalPrice = ticketPrice * quantity;

  // Render Success Screen
  if (successBooking) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col text-zinc-900 dark:text-zinc-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-zinc-200 p-8 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 shadow-lg text-center space-y-6">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto dark:bg-emerald-950/20">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Ticket Confirmed!</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Your registration code is <strong className="text-zinc-800 dark:text-zinc-100 font-bold">{successBooking.bookingCode}</strong>
              </p>
            </div>

            <div className="bg-zinc-50 p-5 rounded-2xl dark:bg-zinc-900 text-left text-sm space-y-3 border border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-medium">Event:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-medium">Quantity:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{successBooking.quantity} ticket(s)</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200/50 pt-3 dark:border-zinc-800">
                <span className="text-zinc-400 font-bold">Total Paid:</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">${successBooking.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/dashboard" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm">
                Go to Dashboard
              </Link>
              <Link href="/" className="flex-1 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl text-sm font-bold border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-800">
                Explore More
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Confirm Reservation</h1>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold dark:bg-rose-950/20 dark:border-rose-900/30">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Summary Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-4">
              <h3 className="font-bold text-lg">Event Details</h3>
              <div className="flex gap-4">
                <div className="h-16 w-24 bg-zinc-100 rounded-xl overflow-hidden dark:bg-zinc-900 flex-shrink-0">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-indigo-50 flex items-center justify-center" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white line-clamp-1">{event.title}</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-1">{event.location}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                    {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-4">
              <h3 className="font-bold text-lg">Select Quantity</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-zinc-200 rounded-full dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 font-bold text-lg focus:outline-none"
                  >
                    -
                  </button>
                  <span className="px-4 font-bold text-sm text-zinc-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(event.availableSeats, quantity + 1))}
                    className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 font-bold text-lg focus:outline-none"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
                  {event.availableSeats} seats left in total
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Sidebar */}
          <div className="bg-white border border-zinc-200 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
            <h3 className="font-bold text-lg">Price Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-medium">Ticket price:</span>
                <span className="font-semibold">${ticketPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-medium">Quantity:</span>
                <span className="font-semibold">x{quantity}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-3 dark:border-zinc-900">
                <span className="text-zinc-900 dark:text-white font-bold">Total price:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={submitting || event.availableSeats <= 0}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
            >
              {submitting ? 'Reserving...' : 'Confirm Ticket Reservation'}
            </button>
            <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 font-semibold mt-1">
              By confirming, you agree to EventHub terms. Bookings are authoritative and immediate.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
