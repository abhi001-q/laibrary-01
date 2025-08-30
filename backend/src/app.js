import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import ROLES from "./config/roles.js";

// Load env vars
dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import librarianRoutes from "./routes/librarianRoutes.js";
import borrowerRoutes from "./routes/borrowerRoutes.js";

const app = express();

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Library API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/librarian", librarianRoutes);
app.use("/api/borrower", borrowerRoutes);

// Admin seeding function
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Use findOneAndUpdate with upsert to create or update the admin user.
    // This ensures the admin user always exists with the correct data and password.
    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name: "Admin User",
          email: adminEmail,
          password: hashedPassword, // This will reset the password on every server start
          role: ROLES.ADMIN,
          isApproved: true,
          isBanned: false,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (admin) {
      console.log("✅ Admin user is ready in the database.");
      console.log("   📧 Email: admin@gmail.com");
      console.log("   🔑 Password: admin123");
    }
  } catch (error) {
    console.log("❌ Error seeding admin:", error.message);
  }
};

// Export the seeding function to be called after DB connection
export { seedAdmin };

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);

  // Handle multer errors
  if (error.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ message: "File too large. Maximum size is 50MB." });
  }

  if (error.message && error.message.includes("Only")) {
    return res.status(400).json({ message: error.message });
  }

  // Handle profile photo specific errors
  if (error.message && error.message.includes("profile photos")) {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({ message: "Something went wrong!" });
});

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
