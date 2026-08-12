'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import DashboardSidebar from '../../../components/layout/DashboardSidebar';
import { Badge, statusVariant } from '../../../components/ui/Badge';
import { getEvents } from '../../../lib/events';
import { getEventBookings, Booking } from '../../../lib/bookings';
import { getCurrentUser, isAuthenticated } from '../../../lib/auth';
import type { User, Event } from '../../../types';

export default function OrganizerBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const u = getCurrentUser();
    if (!u || (u.role !== 'ORGANIZER' && u.role !== 'ADMIN')) {
      router.push('/dashboard');
      return;
    }
    setUser(u);

    loadEvents(u.id);
  }, [router]);

  const loadEvents = async (organizerId: string) => {
    try {
      const res = await getEvents({ organizerId, limit: 100 });
      const evList = res.data || [];
      setEvents(evList);
      if (evList.length > 0) {
        setSelectedEventId(evList[0].id);
        fetchRoster(evList[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchRoster = async (eventId: string) => {
    setLoading(true);
    try {
      const bList = await getEventBookings(eventId);
      setBookings(bList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    fetchRoster(eventId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <span className="text-sm font-semibold text-zinc-400 animate-pulse">Loading bookings...</span>
      </div>
    );
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <div className="hidden md:block">
          <DashboardSidebar role={user.role} userName={user.name} userEmail={user.email} />
        </div>

        <main className="flex-1 space-y-8">
          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800">
            <h1 className="text-2xl font-extrabold tracking-tight">Attendee Reservations</h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Select an event to view ticket registrations and attendee codes.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-900">
              <label className="text-xs font-bold text-zinc-400 uppercase">Select Event:</label>
              <select
                value={selectedEventId}
                onChange={(e) => handleEventChange(e.target.value)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold focus:outline-none"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.availableSeats}/{ev.capacity} seats left)
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs font-semibold text-zinc-400 animate-pulse">
                Fetching reservations...
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500 font-semibold">
                No bookings found for the selected event.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Booking Code</th>
                      <th className="py-3 px-3">Attendee Name</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Quantity</th>
                      <th className="py-3 px-3">Total Paid</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-medium">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40">
                        <td className="py-3.5 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">{b.bookingCode}</td>
                        <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-zinc-100">{b.user?.name || 'Attendee'}</td>
                        <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">{b.user?.email}</td>
                        <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-zinc-100">{b.quantity}</td>
                        <td className="py-3.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">${b.totalPrice.toFixed(2)}</td>
                        <td className="py-3.5 px-3">
                          <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
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
