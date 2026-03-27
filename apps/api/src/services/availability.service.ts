import { prisma } from "../config/database";
import { AppError } from "../middleware/error-handler";
import { SetAvailabilityInput, CreateOverrideInput, TimeSlot } from "@arc/shared";

export async function setAvailability(userId: string, input: SetAvailabilityInput) {
  const profile = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Provider profile not found");

  // Replace all existing availability slots
  await prisma.availability.deleteMany({ where: { providerProfileId: profile.id } });

  const created = await prisma.availability.createMany({
    data: input.slots.map((slot) => ({
      providerProfileId: profile.id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
  });

  return created;
}

export async function getAvailability(providerProfileId: string) {
  return prisma.availability.findMany({
    where: { providerProfileId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function createOverride(userId: string, input: CreateOverrideInput) {
  const profile = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Provider profile not found");

  return prisma.availabilityOverride.upsert({
    where: {
      providerProfileId_date: {
        providerProfileId: profile.id,
        date: new Date(input.date),
      },
    },
    create: {
      providerProfileId: profile.id,
      date: new Date(input.date),
      isBlocked: input.isBlocked,
      startTime: input.startTime,
      endTime: input.endTime,
      reason: input.reason,
    },
    update: {
      isBlocked: input.isBlocked,
      startTime: input.startTime,
      endTime: input.endTime,
      reason: input.reason,
    },
  });
}

export async function getAvailableSlots(
  providerProfileId: string,
  date: string,
  serviceDurationMinutes: number,
): Promise<TimeSlot[]> {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay();

  // Get weekly schedule for this day
  const weeklySlots = await prisma.availability.findMany({
    where: { providerProfileId, dayOfWeek },
    orderBy: { startTime: "asc" },
  });

  if (weeklySlots.length === 0) return [];

  // Check for overrides
  const override = await prisma.availabilityOverride.findUnique({
    where: { providerProfileId_date: { providerProfileId, date: targetDate } },
  });

  if (override?.isBlocked) return [];

  // Get existing bookings for the date
  const dayStart = new Date(date + "T00:00:00Z");
  const dayEnd = new Date(date + "T23:59:59Z");

  const existingBookings = await prisma.booking.findMany({
    where: {
      providerProfileId,
      status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      startTime: { gte: dayStart, lte: dayEnd },
    },
    select: { startTime: true, endTime: true },
  });

  // Generate time slots
  const slots: TimeSlot[] = [];
  const slotInterval = 30; // 30-minute slot intervals

  for (const weekly of weeklySlots) {
    const effectiveStart = override?.startTime || weekly.startTime;
    const effectiveEnd = override?.endTime || weekly.endTime;

    const [startH, startM] = effectiveStart.split(":").map(Number);
    const [endH, endM] = effectiveEnd.split(":").map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes + serviceDurationMinutes <= endMinutes) {
      const slotStart = new Date(targetDate);
      slotStart.setUTCHours(Math.floor(currentMinutes / 60), currentMinutes % 60, 0, 0);

      const slotEnd = new Date(slotStart.getTime() + serviceDurationMinutes * 60 * 1000);

      const isConflict = existingBookings.some(
        (b) => b.startTime < slotEnd && b.endTime > slotStart,
      );

      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        available: !isConflict,
      });

      currentMinutes += slotInterval;
    }
  }

  return slots;
}
