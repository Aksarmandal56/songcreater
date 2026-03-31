# 🎵 SongCraft - Custom Song Creation Platform

A full-stack web application for ordering custom songs with MongoDB Atlas backend and React frontend. Features user authentication, order management, pricing packages, and admin dashboard.

## 🚀 Features

- **User Authentication**: JWT-based login/signup system
- **Custom Song Orders**: Multiple pricing tiers (Personal, Business, Institution)
- **Admin Dashboard**: Order management and analytics
- **Audio Samples**: Preview tracks across different genres
- **Customer Testimonials**: Social proof and reviews
- **Responsive Design**: Mobile-first approach with modern UI
- **Real-time Status Updates**: Order tracking system

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Express.js** with TypeScript
- **MongoDB Atlas** cloud database
- **Mongoose** ODM for data modeling
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **Vercel** for deployment
- **MongoDB Database Tools** for data import

## 📁 Project Structure

```
├── api/                    # Vercel serverless functions (legacy)
├── database/               # MongoDB sample data & import scripts
├── public/                 # Static assets
├── server/                 # Express.js backend
│   ├── models/            # MongoDB schemas
│   └── routes/            # API endpoints
├── src/                   # React frontend
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── lib/               # Utilities and API client
│   └── pages/             # Page components
├── package.json           # Dependencies and scripts
├── server.js              # Main Express server
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🏁 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Git

### 1. Clone and Install

```bash
git clone <repository-url>
cd songcraft
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/songcraft?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

Import sample data:

```bash
./database/import.sh
```

This will populate your MongoDB Atlas database with sample packages, users, orders, and testimonials.

### 4. Start Development Servers

**Backend:**
```bash
npm run server
```

**Frontend:**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@songcraft.com`
- Password: `password123`

**Regular User:**
- Email: `john.doe@example.com`
- Password: `password123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Orders
- `GET /api/orders` - Get all orders (admin) or user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Packages
- `GET /api/packages` - Get all pricing packages
- `POST /api/packages` - Create package (admin)
- `PUT /api/packages/:id` - Update package (admin)
- `DELETE /api/packages/:id` - Delete package (admin)

### Customers
- `GET /api/customers` - Get all customers (admin)
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Samples
- `GET /api/samples` - Get all audio samples
- `POST /api/samples` - Add sample (admin)
- `PUT /api/samples/:id` - Update sample (admin)
- `DELETE /api/samples/:id` - Delete sample (admin)

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Add testimonial (admin)
- `PUT /api/testimonials/:id` - Update testimonial (admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin)

## 🎨 Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server
npm run server       # Start Express backend
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
./database/import.sh # Import sample data to MongoDB
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel using their CLI or dashboard
```

### Backend (Railway, Render, or similar)
```bash
# Set environment variables in your hosting platform
# Deploy server.js as the main entry point
```

### Database
- MongoDB Atlas handles database hosting
- Configure IP whitelisting for production servers
- Set up automated backups

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful component and variable names
- Add JSDoc comments for complex functions

### Database Schema
- All models use Mongoose schemas
- Passwords are automatically hashed
- Timestamps are added automatically
- Validation rules are enforced

### Authentication
- JWT tokens expire after 7 days
- Passwords require minimum 6 characters
- Admin role required for sensitive operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the database README for setup issues
- Review API endpoints for integration questions
- Check browser console for frontend errors
- Verify MongoDB Atlas connection for backend issues

## 🎯 Roadmap

- [ ] Payment integration (Stripe/Razorpay)
- [ ] File upload for custom audio samples
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
