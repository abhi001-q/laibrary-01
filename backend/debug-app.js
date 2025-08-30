import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Library API is running',
    timestamp: new Date().toISOString()
  });
});

console.log('Loading routes...');

// Try to load routes one by one to identify the problem
try {
  console.log('Loading auth routes...');
  const authRoutes = await import('./src/routes/authRoutes.js');
  app.use('/api/auth', authRoutes.default);
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  console.log('Loading book routes...');
  const bookRoutes = await import('./src/routes/bookRoutes.js');
  app.use('/api/books', bookRoutes.default);
  console.log('Book routes loaded successfully');
} catch (error) {
  console.error('Error loading book routes:', error.message);
}

try {
  console.log('Loading admin routes...');
  const adminRoutes = await import('./src/routes/adminRoutes.js');
  app.use('/api/admin', adminRoutes.default);
  console.log('Admin routes loaded successfully');
} catch (error) {
  console.error('Error loading admin routes:', error.message);
}

try {
  console.log('Loading librarian routes...');
  const librarianRoutes = await import('./src/routes/librarianRoutes.js');
  app.use('/api/librarian', librarianRoutes.default);
  console.log('Librarian routes loaded successfully');
} catch (error) {
  console.error('Error loading librarian routes:', error.message);
}

try {
  console.log('Loading borrower routes...');
  const borrowerRoutes = await import('./src/routes/borrowerRoutes.js');
  app.use('/api/borrower', borrowerRoutes.default);
  console.log('Borrower routes loaded successfully');
} catch (error) {
  console.error('Error loading borrower routes:', error.message);
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
