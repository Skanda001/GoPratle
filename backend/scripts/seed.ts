/**
 * Seed script — inserts one sample requirement per category through the service layer.
 * Refuses to run in production. Run with: npm run seed
 */
import dotenv from "dotenv";
dotenv.config();

import { env } from "../src/config/env.js";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { createRequirement } from "../src/services/requirementService.js";

if (env.NODE_ENV === "production") {
  console.error("❌ Seed script cannot run in production.");
  process.exit(1);
}

// Use a future date (1 year from now) so seed data is always valid
function futureDate(offsetDays: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const samples = [
  {
    category: "planner",
    eventName: "Annual Corporate Gala",
    eventType: "corporate_event",
    dateMode: "range",
    startDate: futureDate(0),
    endDate: futureDate(2),
    location: "Mumbai, Maharashtra",
    venue: "Taj Mahal Palace",
    details: {
      guestCount: 250,
      budget: 500000,
      currency: "INR",
      servicesRequired: ["decoration_theme", "catering_coordination", "vendor_management"],
      styleTheme: "Black Tie Elegance",
      planningScope: "full_planning",
      coordinationDays: 3,
      preferredExperience: "experienced",
      specialRequests: "Vegetarian-only catering. Require a live band during dinner.",
    },
  },
  {
    category: "performer",
    eventName: "New Year's Eve Bash",
    eventType: "private_party",
    dateMode: "single",
    startDate: futureDate(30),
    location: "Bengaluru, Karnataka",
    venue: "The Leela Palace",
    details: {
      performanceType: "dj",
      performerCount: 2,
      durationMinutes: 240,
      performanceCount: 1,
      genre: "EDM / House",
      soundSystemRequired: true,
      lightingRequired: true,
      stageRequired: false,
      budgetMin: 50000,
      budgetMax: 150000,
      budgetCurrency: "INR",
      specialInstructions: "DJ must arrive 2 hours before the event for sound check.",
    },
  },
  {
    category: "crew",
    eventName: "Rock Festival 2027",
    eventType: "concert",
    dateMode: "range",
    startDate: futureDate(60),
    endDate: futureDate(62),
    location: "Delhi, NCR",
    details: {
      roles: ["sound_technician", "lighting_technician", "stagehand", "security_staff"],
      crewCount: 30,
      shiftHours: 10,
      shiftCount: 3,
      experienceLevel: "experienced",
      dressCode: "Black crew t-shirt and cargo pants provided on-site.",
      reportingInstructions: "Report to Stage Manager at Gate B by 08:00 each day.",
      equipmentRequired: "Personal safety gear; headsets provided by organizer.",
    },
  },
] as const;

async function seed() {
  await connectDB();
  console.info("🌱 Seeding requirements...\n");

  for (const sample of samples) {
    try {
      const { doc, created } = await createRequirement(sample);
      if (created) {
        console.info(`✅ [${sample.category}] Created: ${doc._id} — ${sample.eventName}`);
      } else {
        console.info(`⚠️  [${sample.category}] Already exists: ${doc._id}`);
      }
    } catch (err) {
      console.error(`❌ [${sample.category}] Failed:`, err);
    }
  }

  await disconnectDB();
  console.info("\n✅ Seeding complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
