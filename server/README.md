# Bus Tracking Backend API

A comprehensive backend API for a bus tracking and booking system built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Password hashing with bcrypt

- **Bus Management**
  - Real-time bus tracking
  - Route management
  - Bus location updates

- **Booking System**
  - Seat booking
  - Ticket generation with QR codes
  - Booking management

- **API Endpoints**
  - RESTful API design
  - Comprehensive error handling
  - Request logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the server directory with the following variables:
   ```env
   PORT=8000
   NODE_ENV=development
   MONGO_URL=mongodb://localhost:27017/bus-tracking
   JWT_SECRET=your-super-secret-jwt-key-here
   CLIENT_URL=http://localhost:5173
   ```

3. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get bus by ID
- `GET /api/buses/route/:routeId` - Get buses by route
- `GET /api/buses/:id/track` - Track specific bus

### Routes
- `GET /api/buses/routes` - Get all routes
- `GET /api/buses/routes/:id` - Get route by ID

### Bookings
- `POST /api/bookings/book` - Create booking (requires auth)
- `GET /api/bookings/my-bookings` - Get user bookings (requires auth)
- `GET /api/bookings/:id` - Get booking by ID (requires auth)
- `PUT /api/bookings/:id/cancel` - Cancel booking (requires auth)
- `POST /api/bookings/verify-ticket` - Verify ticket

## Database Seeding

To populate the database with sample data:

```bash
node seeders/sampleData.js
```

This will create:
- 2 sample routes
- 3 sample buses
- Proper relationships between buses and routes

## Project Structure

```
server/
├── Models/
│   ├── userModels.js      # User schema
│   ├── busModels.js       # Bus and Route schemas
│   └── bookingModels.js   # Booking and Ticket schemas
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── busRoutes.js       # Bus and route routes
│   └── bookingRoutes.js   # Booking routes
├── middleware/
│   └── authMiddleware.js  # JWT authentication
├── utils/
│   └── db.js             # Database connection
├── seeders/
│   └── sampleData.js     # Database seeder
└── index.js              # Main server file
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Development

- The server runs on port 8000 by default
- CORS is configured for the frontend at `http://localhost:5173`
- Morgan is used for request logging
- Error handling includes development vs production modes

## Testing the API

You can test the API using tools like Postman or curl:

```bash
# Test server health
curl http://localhost:8000

# Register a user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Get all routes
curl http://localhost:8000/api/buses/routes
```

## Next Steps

1. Set up your `.env` file with proper values
2. Run the database seeder to populate sample data
3. Start the server and test the endpoints
4. Integrate with your React frontend
5. Add real-time features using WebSockets if needed
