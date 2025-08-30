import dotenv from "dotenv";
import app from "./debug-app.js";

dotenv.config();

const PORT = process.env.PORT || 5002;

// Start the server without DB connection for testing
app.listen(PORT, () => {
  console.log(`🚀 Debug Library API server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
