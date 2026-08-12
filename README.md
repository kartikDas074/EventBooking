# EventHub Frontend

## Overview

The EventHub frontend is a Next.js 16 + React 19 application for browsing events, booking tickets, and managing user accounts. It integrates with the EventHub backend API to handle authentication, event listings, categories, bookings, and admin/organizer workflows.

## Live URL

  https://event-booking-one-psi.vercel.app

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
- Vercel-friendly config

## Project Structure

- `app/` - Next.js app routes and pages
- `app/admin` - Admin dashboard pages
- `app/organizer` - Organizer-specific dashboard pages
- `app/booking/[eventId]` - Booking page for a selected event
- `app/events` - Event listing and detail pages
- `app/login` - Login page
- `app/register` - Registration page
- `src/components/` - UI and reusable components
- `src/lib/` - API helpers and client-side services
- `src/types/` - Type definitions for API models
- `public/` - Static assets

## Getting Started

### Install dependencies

```bash
cd frontend
npm install
```

### Run development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build for production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in `frontend/` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

This value is used by the frontend to call the backend API.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the app for production
- `npm run start` - Start the production build
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend through the following API patterns:

- `src/lib/api.ts` defines `fetchApi()` and uses `NEXT_PUBLIC_API_URL`
- Authentication token is sent in `Authorization: Bearer <token>` headers
- API shape follows the backend response contract:
  - success: `{ success: true, message, data, meta? }`
  - error: `{ success: false, message, error: { code } }`

### Backend endpoints used

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/categories`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/bookings`
- `GET /api/bookings/my`
- `PATCH /api/bookings/:id/cancel`
- `GET /api/events/:eventId/bookings`
- Admin and organizer endpoints via protected calls

## Features

- User registration and login
- Event listing and search
- Category browsing
- Event booking flow
- Organizer event management
- Admin user, category, booking management
- Responsive layouts and reusable UI components

## Authentication Flow

- Login and registration pages call backend auth endpoints
- JWTs are stored in local storage or session state
- Auth headers are attached automatically by helper functions

## Type Definitions

Key type interfaces are defined in `src/types/index.ts`:

- `User`
- `Category`
- `Event`
- `Booking`
- `ApiResponse<T>`
- `PaginationMeta`

## Notes

- The app is designed to run with the backend at `http://localhost:5000` by default.
- Update `NEXT_PUBLIC_API_URL` when deploying to a different backend host.
- The frontend uses the App Router and modern React features.

## Recommended Improvements

- Add page-level loading and error states
- Add client-side form validation for auth and event forms
- Add role-based UI guarding for admin and organizer pages
- Add Cypress or Playwright tests for end-to-end flows
- Add SEO metadata and Open Graph support for event pages
