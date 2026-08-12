'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import DashboardSidebar from '../../../components/layout/DashboardSidebar';
import { Badge, statusVariant } from '../../../components/ui/Badge';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../../lib/events';
import { getCategories } from '../../../lib/categories';
import { getEventBookings, Booking } from '../../../lib/bookings';
import { getCurrentUser, getToken, isAuthenticated } from '../../../lib/auth';
import type { User, Category, Event, EventStatus } from '../../../types';

export default function OrganizerEventsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');

  // Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Roster modal
  const [rosterEvent, setRosterEvent] = useState<Event | null>(null);
  const [rosterBookings, setRosterBookings] = useState<Booking[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    price: 0,
    capacity: 50,
    categoryId: '',
    image: '',
    status: 'PUBLISHED',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const u = getCurrentUser();
    if (!u || (u.role !== 'ORGANIZER' && u.role !== 'ADMIN')) {
      alert('Access restricted to Organizers.');
      router.push('/dashboard');
      return;
    }
    setUser(u);

    loadInitialData(u.id);
  }, [router]);

  const loadInitialData = async (organizerId: string) => {
    setLoading(true);
    try {
      const [cats, evRes] = await Promise.all([
        getCategories(),
        getEvents({ organizerId, limit: 100 }),
      ]);
      setCategories(cats);
      setEvents(evRes.data || []);
      if (cats.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormError('');
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 86400000 + 7200000).toISOString().slice(0, 16),
      price: 25,
      capacity: 100,
      categoryId: categories[0]?.id || '',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
      status: 'PUBLISHED',
    });
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (ev: Event) => {
    setEditingEvent(ev);
    setFormError('');
    setFormData({
      title: ev.title,
      description: ev.description,
      location: ev.location,
      startDate: new Date(ev.startDate).toISOString().slice(0, 16),
      endDate: new Date(ev.endDate).toISOString().slice(0, 16),
      price: ev.price,
      capacity: ev.capacity,
      categoryId: ev.categoryId,
      image: ev.image || '',
      status: ev.status,
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    const token = getToken();
    if (!token) return;

    try {
      const payload = { ...formData, status: formData.status as EventStatus };
      if (editingEvent) {
        const res = await updateEvent(editingEvent.id, payload, token);
        if (res.success) {
          setIsFormOpen(false);
          if (user) loadInitialData(user.id);
        } else {
          setFormError(res.message || 'Failed to update event');
        }
      } else {
        const res = await createEvent(payload, token);
        if (res.success) {
          setIsFormOpen(false);
          if (user) loadInitialData(user.id);
        } else {
          setFormError(res.message || 'Failed to create event');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const token = getToken();
    if (!token) return;

    try {
      const res = await deleteEvent(id, token);
      if (res.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert(res.message || 'Failed to delete event');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting event');
    }
  };

  const handleOpenRoster = async (ev: Event) => {
    setRosterEvent(ev);
    setRosterLoading(true);
    try {
      const bookings = await getEventBookings(ev.id);
      setRosterBookings(bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setRosterLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <span className="text-sm font-semibold text-zinc-400 animate-pulse">Loading portal...</span>
      </div>
    );
  }

  const filteredEvents = activeTab === 'ALL' ? events : events.filter((e) => e.status === activeTab);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar role={user.role} userName={user.name} userEmail={user.email} />
        </div>

        {/* Main Workspace */}
        <main className="flex-1 space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Organizer Workspace</h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Create, edit, publish events, and track attendee rosters in real time.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold shadow-sm transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Event
            </button>
          </div>

          {/* Event Filters & Management Table */}
          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-900">
              {['ALL', 'PUBLISHED', 'DRAFT', 'COMPLETED', 'CANCELLED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    activeTab === tab
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs font-semibold text-zinc-400 animate-pulse">
                Loading your events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl dark:border-zinc-800 space-y-3">
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No events found matching this status filter.</p>
                <button
                  onClick={handleOpenCreateModal}
                  className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full"
                >
                  Create Your First Event
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Event Title</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Seats (Avail/Cap)</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-medium">
                    {filteredEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40">
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 rounded-lg bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex-shrink-0">
                              {ev.image ? (
                                <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-indigo-50 dark:bg-indigo-950/40" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm line-clamp-1">{ev.title}</p>
                              <p className="text-[11px] text-zinc-400">{ev.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                          {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-3 font-bold text-zinc-900 dark:text-zinc-100">
                          {ev.price === 0 ? 'Free' : `$${ev.price.toFixed(2)}`}
                        </td>
                        <td className="py-4 px-3 whitespace-nowrap">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{ev.availableSeats}</span>
                          <span className="text-zinc-400"> / {ev.capacity}</span>
                        </td>
                        <td className="py-4 px-3">
                          <Badge variant={statusVariant(ev.status)}>{ev.status}</Badge>
                        </td>
                        <td className="py-4 px-3 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleOpenRoster(ev)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 hover:bg-indigo-100"
                          >
                            Roster
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(ev)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold text-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ev.id)}
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

      {/* CREATE / EDIT EVENT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <h3 className="text-lg font-extrabold">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-500 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Next.js 16 Masterclass"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Provide full event overview and schedule..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Gulshan-2, Dhaka or Online"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 mb-1">Start Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">End Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-500 mb-1">Ticket Price ($)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Capacity Seats</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROSTER MODAL */}
      {rosterEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-extrabold">Attendee Roster</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{rosterEvent.title}</p>
              </div>
              <button onClick={() => setRosterEvent(null)} className="text-zinc-400 hover:text-zinc-600 text-lg font-bold">
                ✕
              </button>
            </div>

            {rosterLoading ? (
              <div className="text-center py-8 text-xs font-semibold text-zinc-400 animate-pulse">
                Loading attendee records...
              </div>
            ) : rosterBookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                No tickets have been reserved for this event yet.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {rosterBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex justify-between items-center p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs"
                  >
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{b.user?.name || 'Attendee'}</p>
                      <p className="text-[11px] text-zinc-400">{b.user?.email}</p>
                      <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Code: {b.bookingCode}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-1">{b.quantity} seat(s)</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRosterEvent(null)}
                className="px-5 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-xs font-bold"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
