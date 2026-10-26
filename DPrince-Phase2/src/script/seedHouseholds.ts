
import "dotenv/config";
import mongoose, { Types } from "mongoose";

import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../model/User.js";
import Household from "../model/Household.js";

const TOTAL_HOUSEHOLDS = 100;
const SEED_PREFIX = "kilowattz-seed-";
const MOCK_PASSWORD = "KiloWattzDemo2026!";

const seedHouseholds = async (): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seeding is disabled in production.");
  }

  try {
    await connectDB();

    const password = await bcrypt.hash(MOCK_PASSWORD, 10);

    let createdUsers = 0;
    let createdHouseholds = 0;

    for (let i = 1; i <= TOTAL_HOUSEHOLDS; i++) {
      const number = String(i).padStart(3, "0");
      const email = `${SEED_PREFIX}${number}@example.test`;
      const plotNumber = `PLOT-${number}`;
      const meterSerialNumber = `KW-METER-${number}`;

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          fullName: `Mock Resident ${number}`,
          email,
          password,
          role: "user",
          households: [],
          avatarUrl: {
            url: null,
            publicId: null,
          },
        });

        createdUsers++;
      }

      let household = await Household.findOne({
        meterSerialNumber,
      });

      if (!household) {
        household = await Household.create({
          plotNumber,
          street: `Community Street ${((i - 1) % 10) + 1}`,
          dailyKWHQuota: 5 + (i % 11),
          connectionStatus:
            i % 10 === 0
              ? "Suspended"
              : i % 15 === 0
                ? "Disconnected"
                : "Active",
          meterSerialNumber,
          phaseConnection: `Phase ${((i - 1) % 3) + 1}`,
          user: user._id,
        });

        createdHouseholds++;
      } else if (household.user.toString() !== user._id.toString()) {
        household.user = user._id;
        await household.save();
      }

      const alreadyLinked = user.households.some(
        (householdId: Types.ObjectId) =>
          householdId.toString() === household._id.toString()
      );

      if (!alreadyLinked) {
        user.households.push(household._id);
        await user.save();
      }
    }

    const totalSeededHouseholds = await Household.countDocuments({
      meterSerialNumber: {
        $regex: /^KW-METER-\d{3}$/,
      },
    });

    console.log("KiloWattz seeding completed.");
    console.log(`New users created: ${createdUsers}`);
    console.log(`New households created: ${createdHouseholds}`);
    console.log(`Seed households in database: ${totalSeededHouseholds}`);
  } finally {
    await mongoose.disconnect();
  }
};

seedHouseholds().catch((error: unknown) => {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
});
