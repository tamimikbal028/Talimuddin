import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../Backend/.env") });

const potrikaSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    avatar: String,
    coverImage: String,
    postsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Potrika = mongoose.model("Potrika", potrikaSchema);

async function checkPotrikas() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB");

    const count = await Potrika.countDocuments();
    console.log("Total Potrikas:", count);

    const all = await Potrika.find();
    console.log("Potrikas:", JSON.stringify(all, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkPotrikas();
