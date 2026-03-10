import "dotenv/config"; // Must be FIRST - loads env vars before other imports
import mongoose from "mongoose";
import app from "./app.js";

const MONGO_URI = process.env.MONGODB_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    console.warn("Server will start without database connection. API routes will fail.");
  }
};

// Start the server first, then connect to database
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});

// Connect to the database (non-blocking)
connectDB();
