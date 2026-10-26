import mongoose from "mongoose";

async function connectDB() {
  if (mongoose.connections[0].readyState) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MONGO_URI is missing. Add it to a .env file in the project root."
    );
  }

  mongoose.set("strictQuery", false);
  await mongoose.connect(uri);
}

export default connectDB;
