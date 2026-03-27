import { prisma } from "../config/database";
import { AppError } from "../middleware/error-handler";

export async function createReview(
  clientId: string,
  bookingId: string,
  rating: number,
  text?: string,
  photos?: string[],
) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking) throw new AppError(404, "NOT_FOUND", "Booking not found");
  if (booking.clientId !== clientId) throw new AppError(403, "FORBIDDEN", "Not your booking");
  if (booking.status !== "COMPLETED") {
    throw new AppError(400, "VALIDATION_ERROR", "Can only review completed bookings");
  }

  const existing = await prisma.review.findUnique({ where: { bookingId } });
  if (existing) throw new AppError(409, "CONFLICT", "Review already exists for this booking");

  const review = await prisma.review.create({
    data: {
      bookingId,
      clientId,
      providerProfileId: booking.providerProfileId,
      rating,
      text,
      photos: photos || [],
    },
  });

  // Update provider average rating
  const stats = await prisma.review.aggregate({
    where: { providerProfileId: booking.providerProfileId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.providerProfile.update({
    where: { id: booking.providerProfileId },
    data: {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.rating,
    },
  });

  return review;
}

export async function getProviderReviews(providerProfileId: string, page = 1, pageSize = 20) {
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { providerProfileId },
      include: {
        client: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.review.count({ where: { providerProfileId } }),
  ]);

  return { items: reviews, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
