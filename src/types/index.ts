// ─── Enums ──────────────────────────────────────────────────────────────────
export type UserRole = 'USER' | 'ORGANIZER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

// ─── Core models ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  eventCount?: number;
  createdAt?: string;
}

export interface EventOrganizer {
  id: string;
  name: string;
  email?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  availableSeats: number;
  image?: string | null;
  status: EventStatus;
  organizerId: string;
  categoryId: string;
  organizer?: EventOrganizer;
  category?: EventCategory;
  createdAt?: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  bookingCode: string;
  isDeleted?: boolean;
  createdAt: string;
  event?: Pick<Event, 'id' | 'title' | 'location' | 'startDate' | 'image' | 'price'>;
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

// ─── API responses ───────────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  error: { code: string };
}
