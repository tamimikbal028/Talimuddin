import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const run = async () => {
  try {
    const DB_NAME = "Talimuddin-DB";
    await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
    const c = mongoose.connection.db.collection("potrikas");
    const p = await c.findOne({ name: "Al Kausar" });
    if (p) {
      console.log("---ID_START---");
      console.log(p._id.toString());
      console.log("---ID_END---");
    } else {
      console.log("AL_KAUSAR_NOT_FOUND");
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
run();
