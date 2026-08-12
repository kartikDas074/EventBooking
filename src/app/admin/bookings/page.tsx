'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import DashboardSidebar from '../../../components/layout/DashboardSidebar';
import { Badge, statusVariant } from '../../../components/ui/Badge';
import { getAllBookings, updateBookingStatus, Booking } from '../../../lib/bookings';
import { getCurrentUser, isAuthenticated } from '../../../lib/auth';
import type { User } from '../../../types';

export default function AdminBookingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const u = getCurrentUser();
    if (!u || u.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    setCurrentUser(u);

    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings(1, 100);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as any } : b)));
      } else {
        alert(res.message || 'Failed to update status');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <span className="text-sm font-semibold text-zinc-400 animate-pulse">Loading system reservations...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <div className="hidden md:block">
          <DashboardSidebar role={currentUser.role} userName={currentUser.name} userEmail={currentUser.email} />
        </div>

        <main className="flex-1 space-y-8">
          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800">
            <h1 className="text-2xl font-extrabold tracking-tight">Admin: Master Bookings Audit</h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Audit ticket registrations, track revenue, or change reservation statuses system-wide.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
            {loading ? (
              <div className="text-center py-12 text-xs font-semibold text-zinc-400 animate-pulse">
                Fetching master reservations...
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500 font-semibold">
                No system bookings found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Booking Code</th>
                      <th className="py-3 px-3">Event</th>
                      <th className="py-3 px-3">User Email</th>
                      <th className="py-3 px-3">Qty</th>
                      <th className="py-3 px-3">Total Paid</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Booked On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-medium">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40">
                        <td className="py-3.5 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">{b.bookingCode}</td>
                        <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{b.event?.title || 'Event N/A'}</td>
                        <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">{b.user?.email || 'User N/A'}</td>
                        <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-zinc-100">{b.quantity}</td>
                        <td className="py-3.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">${b.totalPrice.toFixed(2)}</td>
                        <td className="py-3.5 px-3">
                          <select
                            disabled={updatingId === b.id}
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-3 text-zinc-400 whitespace-nowrap">
                          {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
