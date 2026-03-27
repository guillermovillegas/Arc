import { stripe } from "../config/stripe";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { AppError } from "../middleware/error-handler";

export async function createStripeConnectAccount(userId: string, email: string) {
  const profile = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Provider profile not found");

  if (profile.stripeAccountId) {
    // Return existing account link for re-onboarding
    const accountLink = await stripe.accountLinks.create({
      account: profile.stripeAccountId,
      refresh_url: `${env.WEB_URL}/dashboard/provider/earnings?stripe=refresh`,
      return_url: `${env.WEB_URL}/dashboard/provider/earnings?stripe=complete`,
      type: "account_onboarding",
    });
    return { url: accountLink.url };
  }

  const account = await stripe.accounts.create({
    type: "express",
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  await prisma.providerProfile.update({
    where: { userId },
    data: { stripeAccountId: account.id },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${env.WEB_URL}/dashboard/provider/earnings?stripe=refresh`,
    return_url: `${env.WEB_URL}/dashboard/provider/earnings?stripe=complete`,
    type: "account_onboarding",
  });

  return { url: accountLink.url };
}

export async function createPaymentIntent(bookingId: string, clientId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { providerProfile: true },
  });

  if (!booking) throw new AppError(404, "NOT_FOUND", "Booking not found");
  if (booking.clientId !== clientId) throw new AppError(403, "FORBIDDEN", "Not your booking");
  if (!booking.providerProfile.stripeAccountId) {
    throw new AppError(400, "PAYMENT_FAILED", "Provider has not set up payments");
  }

  const platformFee = Math.round(
    booking.totalPriceInCents * (env.STRIPE_PLATFORM_FEE_PERCENT / 100),
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: booking.totalPriceInCents,
    currency: "usd",
    application_fee_amount: platformFee,
    transfer_data: {
      destination: booking.providerProfile.stripeAccountId,
    },
    metadata: {
      bookingId: booking.id,
      clientId,
      providerProfileId: booking.providerProfileId,
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      stripePaymentIntentId: paymentIntent.id,
      amountInCents: booking.totalPriceInCents,
      platformFeeInCents: platformFee,
      providerPayoutInCents: booking.totalPriceInCents - platformFee,
      status: "PENDING",
    },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return { clientSecret: paymentIntent.client_secret };
}

export async function handleStripeWebhook(event: {
  type: string;
  data: { object: { id: string; metadata?: Record<string, string> } };
}) {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      await prisma.payment.update({
        where: { stripePaymentIntentId: pi.id },
        data: { status: "SUCCEEDED" },
      });
      if (pi.metadata?.bookingId) {
        await prisma.booking.update({
          where: { id: pi.metadata.bookingId },
          data: { status: "CONFIRMED" },
        });
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      await prisma.payment.update({
        where: { stripePaymentIntentId: pi.id },
        data: { status: "FAILED" },
      });
      break;
    }
    case "account.updated": {
      const account = event.data.object as unknown as { id: string; charges_enabled: boolean };
      if (account.charges_enabled) {
        await prisma.providerProfile.updateMany({
          where: { stripeAccountId: account.id },
          data: { stripeOnboardingComplete: true },
        });
      }
      break;
    }
  }
}

export async function getProviderEarnings(userId: string) {
  const profile = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Provider profile not found");

  const payments = await prisma.payment.findMany({
    where: {
      booking: { providerProfileId: profile.id },
      status: "SUCCEEDED",
    },
    include: {
      booking: {
        select: { startTime: true, service: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalEarnings = payments.reduce((sum, p) => sum + p.providerPayoutInCents, 0);

  return { totalEarnings, payments };
}
