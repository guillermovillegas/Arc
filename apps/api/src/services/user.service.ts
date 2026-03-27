import { prisma } from "../config/database";
import { AppError } from "../middleware/error-handler";
import { UpdateUserProfileInput, UpdateProviderProfileInput } from "@arc/shared";

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      role: true,
      isActive: true,
      createdAt: true,
      providerProfile: true,
    },
  });

  if (!user) throw new AppError(404, "NOT_FOUND", "User not found");
  return user;
}

export async function updateUserProfile(userId: string, input: UpdateUserProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      role: true,
    },
  });
}

export async function updateProviderProfile(userId: string, input: UpdateProviderProfileInput) {
  const profile = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Provider profile not found");

  return prisma.providerProfile.update({
    where: { userId },
    data: input,
  });
}
