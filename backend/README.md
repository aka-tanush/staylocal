# StayLocal Backend

A complete backend for the StayLocal Homestay Tourism Platform. Built with Node.js, Express, MongoDB, and JSON Web Tokens.

## Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Running Locally

1. Ensure dependencies are installed: `npm install`
2. Run the development server (if nodemon is installed) or simply: `npm start`
3. The server will run on `http://localhost:5000`

## API Endpoints

### Auth
- **POST** `/api/auth/register` - Register a new user (`name`, `email`, `password`, `role`: `tourist`, `host`, `admin`)
- **POST** `/api/auth/login` - Login (`email`, `password`) -> Returns JWT
- **GET** `/api/auth/me` - Get current logged in user (Requires Auth)

### Users
- **GET** `/api/users/profile` - Get user profile and wishlist (Requires Auth)
- **PUT** `/api/users/profile` - Update profile (`name`, `phone`, `password`, `profilePicture` via form-data) (Requires Auth)
- **POST** `/api/users/wishlist/:homestayId` - Add homestay to wishlist (Requires Auth)
- **DELETE** `/api/users/wishlist/:homestayId` - Remove homestay from wishlist (Requires Auth)
- **GET** `/api/users` - Get all users (Requires Auth/Admin)

### Homestays
- **GET** `/api/homestays` - Get all homestays (Supports `?keyword=` and `?pageNumber=`)
- **GET** `/api/homestays/:id` - Get single homestay
- **POST** `/api/homestays` - Create homestay (Requires Auth/Host or Admin). Supports image upload (form-data: `images`, `title`, `description`, `price`, `location`)
- **PUT** `/api/homestays/:id` - Update homestay (Requires Auth/Host or Admin)
- **DELETE** `/api/homestays/:id` - Delete homestay (Requires Auth/Host or Admin)
- **GET** `/api/homestays/host/mylisted` - Get all homestays listed by the logged-in host (Requires Auth/Host or Admin)

### Bookings
- **POST** `/api/bookings` - Create a booking (`homestayId`, `checkInDate`, `checkOutDate`, `guests`) (Requires Auth)
- **GET** `/api/bookings/mybookings` - View my bookings (tourist) (Requires Auth)
- **GET** `/api/bookings/host` - View bookings on my homestays (host) (Requires Auth/Host or Admin)
- **DELETE** `/api/bookings/:id` - Cancel a booking (Requires Auth)
