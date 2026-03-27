export const PaymentStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export interface Payment {
  id: string;
  bookingId: string;
  stripePaymentIntentId: string;
  amountInCents: number;
  platformFeeInCents: number;
  providerPayoutInCents: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}
