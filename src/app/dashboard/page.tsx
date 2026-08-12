'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import { Badge, statusVariant } from '../../components/ui/Badge';
import { getMyBookings, cancelBooking, Booking } from '../../lib/bookings';
import { getCurrentUser, isAuthenticated } from '../../lib/auth';
import type { User } from '../../types';

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const u = getCurrentUser();
    setUser(u);

    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This will restore seats to the event.')) return;
    setCancellingId(id);
    try {
      const res = await cancelBooking(id);
      if (res.success) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b)));
      } else {
        alert(res.message || 'Failed to cancel booking.');
      }
    } catch (err: any) {
      alert(err.message || 'Error cancelling booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <span className="text-sm font-semibold text-zinc-400 animate-pulse">Loading profile...</span>
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const totalSpent = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar role={user.role} userName={user.name} userEmail={user.email} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, {user.name}! 👋</h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Manage your event bookings, track registrations, and discover new experiences.
              </p>
            </div>
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-colors"
            >
              Explore Events
            </Link>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl dark:bg-zinc-950 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase">Total Bookings</span>
              <p className="text-2xl font-black mt-1 text-indigo-600 dark:text-indigo-400">{bookings.length}</p>
            </div>
            <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl dark:bg-zinc-950 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase">Active Tickets</span>
              <p className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{activeBookings.length}</p>
            </div>
            <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl dark:bg-zinc-950 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase">Total Invested</span>
              <p className="text-2xl font-black mt-1 text-zinc-900 dark:text-zinc-50">${totalSpent.toFixed(2)}</p>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">My Reserved Tickets</h2>
              <button
                onClick={fetchBookings}
                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Refresh List
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-xs font-semibold text-zinc-400 animate-pulse">
                Fetching your bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl dark:border-zinc-800 space-y-3">
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">You haven't reserved any tickets yet.</p>
                <Link
                  href="/events"
                  className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition-colors"
                >
                  Browse Available Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-400">{booking.bookingCode}</span>
                        <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
                      </div>
                      <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-50">
                        {booking.event?.title || 'Event Title N/A'}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {booking.event?.startDate
                          ? new Date(booking.event.startDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Date TBD'}{' '}
                        • {booking.event?.location || 'Location TBD'}
                      </p>
                      <p className="text-xs font-medium text-zinc-400">
                        {booking.quantity} ticket(s) • Total: ${booking.totalPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {booking.event?.id && (
                        <Link
                          href={`/events/${booking.event.id}`}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                        >
                          View Event
                        </Link>
                      )}
                      {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 transition-colors disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Reservation'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
