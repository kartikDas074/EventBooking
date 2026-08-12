import React from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryCard from '../components/events/CategoryCard';
import EventCard from '../components/events/EventCard';
import HeroSearch from '../components/events/HeroSearch';
import { getCategories } from '../lib/categories';
import { getEvents } from '../lib/events';

export default async function Home() {
  // Fetch landing page data
  const [categories, featuredRes, upcomingRes] = await Promise.all([
    getCategories(),
    getEvents({ limit: 6, status: 'PUBLISHED' }),
    getEvents({ limit: 3, sort: 'date_asc', status: 'PUBLISHED' }),
  ]);

  const featuredEvents = featuredRes?.data || [];
  const upcomingEvents = upcomingRes?.data || [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white to-zinc-50 py-24 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-extrabold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-6 ring-1 ring-indigo-500/20 shadow-sm">
            ✨ Next-Gen Event Discovery &amp; Ticketing Platform
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl leading-[1.1]">
            Experience Unforgettable <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Live &amp; Virtual Events
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-medium">
            Discover tech workshops, business summits, live concerts, and sports games near you. Reserve verified tickets with zero hassle.
          </p>

          {/* Hero Search Widget */}
          <div className="mt-10 w-full flex justify-center">
            <HeroSearch />
          </div>

          {/* Quick CTAs */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-transparent rounded-full text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/25"
            >
              Explore All Events
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-zinc-200/90 rounded-full text-sm font-bold bg-white text-zinc-800 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900 shadow-sm transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Taxonomies</span>
                <h2 className="text-3xl font-black tracking-tight mt-1">Browse by Category</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  Select a topic to explore tailored workshops and conferences.
                </p>
              </div>
              <Link
                href="/events"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View All Categories →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/events?category=${encodeURIComponent(category.name)}`}>
                  <CategoryCard category={category} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Events Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/60 pb-5 dark:border-zinc-800/60">
            <div>
              <span className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Handpicked</span>
              <h2 className="text-3xl font-black tracking-tight mt-1">Featured Events</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                Top trending gatherings with available seating.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-full transition-colors"
            >
              Explore Catalog ({featuredEvents.length}+ Events)
            </Link>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-zinc-200 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800">
              <p className="text-sm font-semibold text-zinc-500">No events currently published.</p>
            </div>
          )}
        </section>

        {/* Why Choose EventHub Platform Features */}
        <section className="bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-12 dark:bg-zinc-950 dark:border-zinc-800/80 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Platform Features</span>
            <h2 className="text-3xl font-black">Why Event Enthusiasts Choose EventHub</h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Built for seamless event discovery, instant seat reservations, and organizer workflow management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-3 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center font-bold">
                ⚡️
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">Instant Ticket Reservation</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Atomic seats allocation ensures you never lose a ticket during checkout. Receive unique QR-ready booking codes instantly.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center font-bold">
                🛡️
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">Verified Organizers</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                All events are vetted by verified system organizers with real-time attendee roster tracking and seating management.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
                📊
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">Dedicated User Dashboards</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Manage your reservations, view attendee tickets, cancel bookings, or organize events from role-tailored dashboards.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Experiences Section */}
        {upcomingEvents.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Calendar</span>
                <h2 className="text-3xl font-black tracking-tight mt-1">Upcoming Experiences</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  Mark your schedule for these near-term upcoming events.
                </p>
              </div>

              <Link href="/events" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                See Full Schedule →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white py-16 px-8 sm:px-16 text-center shadow-xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black">Ready to discover your next event?</h2>
            <p className="text-indigo-100 max-w-xl mx-auto text-xs sm:text-base font-medium">
              Join thousands of eventgoers discovering workshops, tech conferences, and live entertainment on EventHub.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold rounded-full text-sm shadow-lg transition-transform hover:scale-105"
              >
                Browse All Events Now
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-indigo-950/60 hover:bg-indigo-950 text-white border border-indigo-400/30 font-bold rounded-full text-sm shadow-lg transition-transform hover:scale-105"
              >
                Sign Up as Organizer
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
