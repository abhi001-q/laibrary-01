import dotenv from "dotenv";
import mockConnectDB from "./src/config/mock-db.js";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// Connect to mock database
mockConnectDB()
  .then(() => {
    console.log('\n=== MOCK DATABASE CONNECTION: SUCCESS ===');
    console.log('Mock database is ready for testing');
    console.log(`Server will run at: http://localhost:${PORT}`);

    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Library API server running on port ${PORT}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('\n=== DATABASE CONNECTION: FAILED ===');
    console.error('Error occurred while connecting to database');
    console.error('Error details:', error.message);
    process.exit(1);
  });
