import mongoose from "mongoose";
import { Potrika } from "../src/models/potrika.model.js";
import { User } from "../src/models/user.model.js";
import { DB_NAME } from "../src/constants/common.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const createPotrika = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error("DB_URL is not defined in .env file");
    }

    console.log(`Connecting to ${dbUrl}/${DB_NAME}...`);
    await mongoose.connect(`${dbUrl}/${DB_NAME}`);
    console.log("Connected to MongoDB");

    const potrikaName = "Al Kausar";
    const potrikaDescription =
      "Monthly Al-Kausar is a research-based Islamic magazine published by Markazud Dawah Al-Islamia Dhaka.";

    // Find the owner user
    const ownerUser = await User.findOne({ userName: "tamim_main" });
    if (!ownerUser) {
      console.warn(
        "⚠️ User 'tamim_main' not found. Creating Potrika without admin."
      );
    }

    // Check if it already exists
    const existingPotrika = await Potrika.findOne({ name: potrikaName });
    if (existingPotrika) {
      console.log(
        `Potrika "${potrikaName}" already exists. Updating admins...`
      );
      if (ownerUser && !existingPotrika.admins.includes(ownerUser._id)) {
        existingPotrika.admins.push(ownerUser._id);
        await existingPotrika.save();
        console.log("✅ Added tamim_main as admin.");
      }
      process.exit(0);
    }

    const newPotrika = await Potrika.create({
      name: potrikaName,
      description: potrikaDescription,
      avatar:
        "https://res.cloudinary.com/dr7xx5ch4/image/upload/v1738423232/alkausar_avatar.png",
      coverImage:
        "https://res.cloudinary.com/dr7xx5ch4/image/upload/v1738423232/alkausar_cover.jpg",
      postsCount: 0,
      admins: ownerUser ? [ownerUser._id] : [],
    });

    console.log("✅ Potrika created successfully!");
    console.log("Details:", newPotrika);
    console.log(
      "\n⚠️ IMPORTANT: Update the DEFAULT_POTRIKA_ID in Frontend/src/constants/potrika.ts with this ID:"
    );
    console.log(`ID: ${newPotrika._id}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating Potrika:", error.message);
    process.exit(1);
  }
};

createPotrika();
