import "dotenv/config"; // Must be FIRST - loads env vars before other imports
import mongoose from "mongoose";
import app from "./app.js";

const MONGO_URI =
  process.env.MONGO_DB_URL ||
  "mongodb+srv://saif_db_user:bZvQrVLdS6XQOIcb@jobpulse-cluster.fstw20s.mongodb.net/";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB!");
    console.log("MongoDB URI:", MONGO_URI);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Connect to the database
await connectDB();

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
