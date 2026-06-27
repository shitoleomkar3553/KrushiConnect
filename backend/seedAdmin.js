const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const User     = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // ── Seed Owner Admin ──────────────────────────────────
    const ownerEmail = process.env.OWNER_ADMIN_EMAIL || "ishwar@krushiconnect.com";
    const ownerExists = await User.findOne({ email: ownerEmail });

    if (ownerExists) {
      console.log(`Owner admin already exists: ${ownerEmail}`);
    } else {
      await User.create({
        name    : process.env.OWNER_ADMIN_NAME     || "Ishwar Shitole",
        email   : ownerEmail,
        password: process.env.OWNER_ADMIN_PASSWORD || "Owner@Krushi2024",
        phone   : process.env.OWNER_ADMIN_PHONE    || "9881553653",
        village : process.env.OWNER_ADMIN_VILLAGE  || "Pimpalgaon",
        role    : "owner_admin",
      });
      console.log(`Owner admin created: ${ownerEmail}`);
    }

    // ── Seed Demo Admin ───────────────────────────────────
    const demoEmail = process.env.DEMO_ADMIN_EMAIL || "demo@krushiconnect.com";
    const demoExists = await User.findOne({ email: demoEmail });

    if (demoExists) {
      console.log(`Demo admin already exists: ${demoEmail}`);
    } else {
      await User.create({
        name    : process.env.DEMO_ADMIN_NAME     || "Demo Admin",
        email   : demoEmail,
        password: process.env.DEMO_ADMIN_PASSWORD || "Demo@1234",
        phone   : process.env.DEMO_ADMIN_PHONE    || "0000000000",
        village : process.env.DEMO_ADMIN_VILLAGE  || "Demo",
        role    : "demo_admin",
      });
      console.log(`Demo admin created: ${demoEmail}`);
    }

    console.log("\n✅ Seeding completed successfully!");
    console.log("─────────────────────────────────────");
    console.log(`Owner Admin → ${ownerEmail} / ${process.env.OWNER_ADMIN_PASSWORD || "Owner@Krushi2024"}`);
    console.log(`Demo Admin  → ${demoEmail} / ${process.env.DEMO_ADMIN_PASSWORD  || "Demo@1234"}`);
    console.log("─────────────────────────────────────");

    process.exit(0);

  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();