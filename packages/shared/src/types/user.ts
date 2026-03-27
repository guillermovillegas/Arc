import { UserRole } from "../constants/roles";

export interface User {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  slug: string;
  bio: string | null;
  businessName: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  serviceRadius: number;
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderWithUser extends ProviderProfile {
  user: User;
}

export interface PortfolioItem {
  id: string;
  providerProfileId: string;
  imageUrl: string;
  caption: string | null;
  serviceId: string | null;
  sortOrder: number;
  createdAt: string;
}
