'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import DashboardSidebar from '../../../components/layout/DashboardSidebar';
import { Badge, statusVariant } from '../../../components/ui/Badge';
import { getEvents, updateEvent, deleteEvent } from '../../../lib/events';
import { getCurrentUser, getToken, isAuthenticated } from '../../../lib/auth';
import type { User, Event, EventStatus } from '../../../types';

export default function AdminEventsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
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

    fetchEvents();
  }, [router]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents({ limit: 100 });
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: EventStatus) => {
    setUpdatingId(eventId);
    const token = getToken();
    if (!token) return;

    try {
      const res = await updateEvent(eventId, { status: newStatus }, token);
      if (res.success) {
        setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e)));
      } else {
        alert(res.message || 'Failed to update status');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setUpdatingId(eventId);
    const token = getToken();
    if (!token) return;

    try {
      const res = await deleteEvent(eventId, token);
      if (res.success) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      } else {
        alert(res.message || 'Failed to delete event');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting event');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <span className="text-sm font-semibold text-zinc-400 animate-pulse">Loading system events...</span>
      </div>
    );
  }

  const filteredEvents = statusFilter === 'ALL' ? events : events.filter((e) => e.status === statusFilter);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <div className="hidden md:block">
          <DashboardSidebar role={currentUser.role} userName={currentUser.name} userEmail={currentUser.email} />
        </div>

        <main className="flex-1 space-y-8">
          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800">
            <h1 className="text-2xl font-extrabold tracking-tight">Admin: Global Events Overview</h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Audit, publish, suspend, or remove events across all platform organizers.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-900">
              {['ALL', 'PUBLISHED', 'DRAFT', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    statusFilter === st
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs font-semibold text-zinc-400 animate-pulse">
                Fetching system events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500 font-semibold">
                No events found matching status filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Event Title</th>
                      <th className="py-3 px-3">Organizer</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Seats Left</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-medium">
                    {filteredEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40">
                        <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-zinc-100">{ev.title}</td>
                        <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">{ev.organizer?.name || 'N/A'}</td>
                        <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">{ev.category?.name || 'N/A'}</td>
                        <td className="py-3.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                          {ev.availableSeats} / {ev.capacity}
                        </td>
                        <td className="py-3.5 px-3">
                          <select
                            disabled={updatingId === ev.id}
                            value={ev.status}
                            onChange={(e) => handleStatusChange(ev.id, e.target.value as EventStatus)}
                            className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none"
                          >
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="DRAFT">DRAFT</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            disabled={updatingId === ev.id}
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100"
                          >
                            Delete
                          </button>
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
