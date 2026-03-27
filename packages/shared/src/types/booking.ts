import { BookingStatus } from "../constants/booking-status";

export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  providerProfileId: string;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  totalPriceInCents: number;
  notes: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithDetails extends Booking {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  service: {
    id: string;
    name: string;
    category: string;
    durationMinutes: number;
  };
  provider: {
    id: string;
    businessName: string | null;
    slug: string;
    user: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
}
