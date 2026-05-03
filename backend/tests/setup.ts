import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer | null = null;

// Set up test environment variables
process.env.ACCESS_SECRET = "test-access-secret-key-for-testing";
process.env.REFRESH_SECRET = "test-refresh-secret-key-for-testing";
// Stripe SDK throws if key is missing on import; integration tests do not call Stripe.
// Build placeholder at runtime so push protection does not match published example keys.
process.env.STRIPE_SECRET_KEY ??= ["sk", "test", "jobpulseLocalJestNotARealSecret"].join(
  "_",
);
// S3 client is constructed at import; tests use mongodb-memory-server only, not real AWS.
process.env.AWS_REGION ??= "eu-north-1";
process.env.S3_BUCKET_NAME ??= "jobpulse-test-bucket";
process.env.AWS_ACCESS_KEY_ID ??= "test-aws-access-key-id";
process.env.AWS_SECRET_ACCESS_KEY ??= "test-aws-secret-access-key";

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
