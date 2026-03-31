# SongCraft AI - MongoDB Atlas Migration

This project has been migrated from Supabase to MongoDB Atlas with a custom Express.js backend.

## 🚀 Setup Instructions

### 1. MongoDB Atlas Setup
1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button

### 2. Environment Configuration
Update your `.env` file with your MongoDB Atlas credentials:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/songcraft?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000

# Frontend API Configuration
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Backend Server
```bash
npm run server
```

### 5. Start the Frontend (in another terminal)
```bash
npm run dev
```

## 📊 Database Schema

### Collections:
- **users**: User authentication and profiles
- **orders**: Song orders with customer details
- **packages**: Pricing packages (Personal/Business/Institution)
- **customers**: Customer management
- **samples**: Audio samples
- **testimonials**: Customer reviews

### Key Features:
- JWT-based authentication
- Role-based access (user/admin)
- CRUD operations for all entities
- Input validation with express-validator
- Password hashing with bcrypt
- CORS enabled for frontend communication

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Data Operations
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Create package (admin)
- `GET /api/samples` - Get all samples
- `POST /api/samples` - Create sample (admin)
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create testimonial (admin)
- `GET /api/orders` - Get all orders (authenticated)
- `POST /api/orders` - Create order
- `GET /api/customers` - Get all customers (authenticated)

## 🛠️ Development

### Adding New Models
1. Create model in `server/models/`
2. Create route in `server/routes/`
3. Add route to `server.js`

### Authentication Middleware
Use `authenticateToken` middleware for protected routes:
```javascript
router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains decoded JWT payload
});
```

## 🚀 Deployment

### Backend Deployment
Deploy the Express server to services like:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

### Frontend Deployment
The Vite build can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Update `VITE_API_URL` in production to point to your deployed backend.

## 🔒 Security Notes

- Change the `JWT_SECRET` in production
- Use HTTPS in production
- Consider rate limiting for API endpoints
- Validate all user inputs
- Use environment variables for sensitive data

## 📝 Migration Notes

This migration replaces Supabase with:
- **MongoDB Atlas** instead of PostgreSQL
- **JWT authentication** instead of Supabase Auth
- **Express.js API** instead of Supabase REST API
- **Custom backend** for full control over business logic

All original functionality is preserved with improved flexibility and scalability.