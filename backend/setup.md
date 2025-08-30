# Environment Setup

## Required Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/library_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Quick Setup Commands

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

## Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections when it first connects.

## Testing the API

Once the server is running, you can test the health endpoint:

- `GET http://localhost:5000/health`

This should return:

```json
{
  "status": "OK",
  "message": "Library API is running"
}
```

## Important Note

The system now uses updated terminology:
- **Librarians** (instead of Sellers) - can upload and manage books
- **Borrowers** (instead of Buyers) - can borrow and read books
- **Admins** - manage the entire system
