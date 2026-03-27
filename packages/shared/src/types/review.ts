export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  providerProfileId: string;
  rating: number; // 1-5
  text: string | null;
  photos: string[];
  createdAt: string;
}

export interface ReviewWithClient extends Review {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}
