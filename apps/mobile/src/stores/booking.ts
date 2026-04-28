import { create } from "zustand";

export type BookingState = {
  serviceSlug: string | null;
  serviceLabel: string | null;
  servicePrice: string | null;
  day: string | null;
  time: string | null;
  setService: (slug: string, label: string, price: string) => void;
  setWindow: (day: string, time: string) => void;
  reset: () => void;
};

const initialState = {
  serviceSlug: null,
  serviceLabel: null,
  servicePrice: null,
  day: null,
  time: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setService: (slug, label, price) =>
    set({ serviceSlug: slug, serviceLabel: label, servicePrice: price }),
  setWindow: (day, time) => set({ day, time }),
  reset: () => set({ ...initialState }),
}));
