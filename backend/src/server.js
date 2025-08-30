import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app, { seedAdmin } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB()
  .then(async () => {
    console.log("\n=== DATABASE CONNECTION: SUCCESS ===");
    console.log("MongoDB is connected and ready for queries");
    console.log(`Server will run at: http://localhost:${PORT}`);

    // Seed admin user after database connection
    try {
      await seedAdmin();
    } catch (error) {
      console.log("Admin seeding error:", error.message);
    }

    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Library API server running on port ${PORT}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error("\n=== DATABASE CONNECTION: FAILED ===");
    console.error("Error occurred while connecting to MongoDB");
    console.error("Error details:", error.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});
