import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const DB_NAME = "Talimuddin-DB";

const fixEmailIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Get all indexes
    const indexes = await usersCollection.indexes();
    console.log("\n📋 Current indexes:");
    indexes.forEach((index) => {
      console.log(`  - ${index.name}:`, index.key);
    });

    // Check if email_1 index exists
    const emailIndexExists = indexes.some((index) => index.name === "email_1");

    if (emailIndexExists) {
      console.log("\n🗑️  Dropping old email_1 index...");
      await usersCollection.dropIndex("email_1");
      console.log("✅ Old email_1 index dropped");
    } else {
      console.log("\n⚠️  No email_1 index found to drop");
    }

    // Create new sparse unique index
    console.log("\n🔨 Creating new sparse unique index on email...");
    await usersCollection.createIndex(
      { email: 1 },
      { unique: true, sparse: true }
    );
    console.log("✅ New sparse unique index created on email");

    // Verify new indexes
    const newIndexes = await usersCollection.indexes();
    console.log("\n📋 Updated indexes:");
    newIndexes.forEach((index) => {
      console.log(`  - ${index.name}:`, index.key);
      if (index.name === "email_1") {
        console.log(`    sparse: ${index.sparse}, unique: ${index.unique}`);
      }
    });

    console.log("\n✅ Email index fix completed successfully!");
  } catch (error) {
    console.error("❌ Error fixing email index:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

fixEmailIndex();
