import { ServiceCategory } from "../constants/categories";

export interface Service {
  id: string;
  providerProfileId: string;
  name: string;
  description: string | null;
  category: ServiceCategory;
  durationMinutes: number;
  priceInCents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
