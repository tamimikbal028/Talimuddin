import mongoose from "mongoose";
import { DB_NAME } from "../constants/index.js";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log(`\nMongoDB connected !! DB Host: ${mongoose.connection.host}`);
  });

  mongoose.connection.on("error", (err) => {
    console.error(`MongoDB runtime connection error: ${err}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connection lost. Attempting to reconnect...");
  });

  try {
    await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
  } catch (error) {
    console.error(`\nInitial MongoDB connection FAILED: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
