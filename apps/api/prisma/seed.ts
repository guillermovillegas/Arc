import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@arc.app" },
    update: {},
    create: {
      email: "admin@arc.app",
      passwordHash: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });

  // Create sample provider
  const providerPassword = await bcrypt.hash("provider123", 12);
  const provider = await prisma.user.upsert({
    where: { email: "demo.barber@arc.app" },
    update: {},
    create: {
      email: "demo.barber@arc.app",
      passwordHash: providerPassword,
      firstName: "Marcus",
      lastName: "Johnson",
      role: "PROVIDER",
      providerProfile: {
        create: {
          slug: "marcus-johnson",
          bio: "10+ years of experience specializing in fades, tapers, and beard grooming. Mobile-friendly - I come to you!",
          businessName: "Marcus Cuts",
          address: "Atlanta, GA",
          latitude: 33.749,
          longitude: -84.388,
          serviceRadius: 25,
          isVerified: true,
          averageRating: 4.8,
          totalReviews: 47,
        },
      },
    },
    include: { providerProfile: true },
  });

  // Add services to provider
  if (provider.providerProfile) {
    await prisma.service.createMany({
      data: [
        {
          providerProfileId: provider.providerProfile.id,
          name: "Classic Fade",
          description: "Clean fade with sharp lineup",
          category: "FADE",
          durationMinutes: 45,
          priceInCents: 3500,
        },
        {
          providerProfileId: provider.providerProfile.id,
          name: "Haircut & Beard",
          description: "Full haircut with beard trim and shape",
          category: "HAIRCUT",
          durationMinutes: 60,
          priceInCents: 5000,
        },
        {
          providerProfileId: provider.providerProfile.id,
          name: "Beard Trim",
          description: "Beard shape-up and trim",
          category: "BEARD",
          durationMinutes: 20,
          priceInCents: 2000,
        },
      ],
      skipDuplicates: true,
    });

    // Add weekly availability (Mon-Sat 9am-6pm)
    for (let day = 1; day <= 6; day++) {
      await prisma.availability.upsert({
        where: {
          providerProfileId_dayOfWeek_startTime: {
            providerProfileId: provider.providerProfile.id,
            dayOfWeek: day,
            startTime: "09:00",
          },
        },
        update: {},
        create: {
          providerProfileId: provider.providerProfile.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
        },
      });
    }
  }

  // Create sample client
  const clientPassword = await bcrypt.hash("client123", 12);
  await prisma.user.upsert({
    where: { email: "demo.client@arc.app" },
    update: {},
    create: {
      email: "demo.client@arc.app",
      passwordHash: clientPassword,
      firstName: "David",
      lastName: "Smith",
      role: "CLIENT",
    },
  });

  console.log("Seed complete!");
  console.log(`Admin: admin@arc.app / admin123`);
  console.log(`Provider: demo.barber@arc.app / provider123`);
  console.log(`Client: demo.client@arc.app / client123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
