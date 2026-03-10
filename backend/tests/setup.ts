import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer | null = null;

// Set up test environment variables
process.env.ACCESS_SECRET = "test-access-secret-key-for-testing";
process.env.REFRESH_SECRET = "test-refresh-secret-key-for-testing";

beforeAll(async () => {
  // Only create server if not already connected (handles parallel test files)
  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  // Only disconnect if this instance created the server
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
    mongoServer = null;
  }
});

afterEach(async () => {
  // Clear all collections after each test
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});
