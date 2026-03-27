import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import * as paymentService from "../services/payment.service";
import { stripe } from "../config/stripe";
import { env } from "../config/env";

const router = Router();

// Create Stripe Connect account for provider
router.post(
  "/connect",
  authenticate,
  requireRole("PROVIDER"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await paymentService.createStripeConnectAccount(
        req.user!.userId,
        req.body.email,
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

// Create payment intent for a booking
router.post(
  "/intent/:bookingId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await paymentService.createPaymentIntent(
        req.params.bookingId,
        req.user!.userId,
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

// Stripe webhook handler
router.post(
  "/webhook",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sig = req.headers["stripe-signature"] as string;
      const event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
      await paymentService.handleStripeWebhook(event as Parameters<typeof paymentService.handleStripeWebhook>[0]);
      res.json({ received: true });
    } catch (err) {
      next(err);
    }
  },
);

// Get provider earnings
router.get(
  "/earnings",
  authenticate,
  requireRole("PROVIDER"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const earnings = await paymentService.getProviderEarnings(req.user!.userId);
      res.json({ success: true, data: earnings });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
