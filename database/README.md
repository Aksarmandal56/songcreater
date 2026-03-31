# MongoDB Atlas Database Setup

This directory contains sample data and import scripts for setting up your MongoDB Atlas database with initial data for the SongCraft application.

## 📁 Files Overview

- `packages.json` - Pricing packages (Personal, Business, Institution)
- `users.json` - User accounts (admin + sample users)
- `customers.json` - Customer records
- `orders.json` - Sample song orders
- `samples.json` - Audio sample tracks
- `testimonials.json` - Customer testimonials
- `import.sh` - Automated import script

## 🚀 Quick Setup

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster (M0 tier)
3. Create a database user with read/write permissions
4. Get your connection string from "Connect" → "Connect your application"

### 2. Update Environment Variables

Edit your `.env` file:

```env
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/songcraft?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server port
PORT=5000

# Frontend API URL
VITE_API_URL=http://localhost:5000/api
```

### 3. Import Sample Data

Run the automated import script:

```bash
# Make sure you're in the project root directory
./database/import.sh
```

Or import manually using mongoimport:

```bash
# Replace YOUR_CONNECTION_STRING with your actual MongoDB Atlas URI
mongoimport --uri="YOUR_CONNECTION_STRING" --db="songcraft" --collection="packages" --file="database/packages.json" --jsonArray
mongoimport --uri="YOUR_CONNECTION_STRING" --db="songcraft" --collection="users" --file="database/users.json" --jsonArray
mongoimport --uri="YOUR_CONNECTION_STRING" --db="songcraft" --collection="customers" --file="database/customers.json" --jsonArray
mongoimport --uri="YOUR_CONNECTION_STRING" --db="songcraft" --collection="orders" --file="database/orders.json" --jsonArray
mongoimport --uri="YOUR_CONNECTION_STRING" --db="songcraft" --collection="samples" --file="database/samples.json" --jsonArray
mongoimport --uri="YOUR_CONNECTION_STRING" --db="songcraft" --collection="testimonials" --file="database/testimonials.json" --jsonArray
```

## 🔐 Default Login Credentials

After importing the sample data, you can login with:

**Admin Account:**
- Email: `admin@songcraft.com`
- Password: `password123`

**Regular User:**
- Email: `john.doe@example.com`
- Password: `password123`

## 📊 Sample Data Overview

### Packages (3 records)
- Personal Song (₹3,999, 24hr delivery)
- Small Business Song (₹9,100, 72hr delivery)
- Institution Song (₹21,000, 160hr delivery)

### Users (3 records)
- 1 Admin user
- 2 Regular users

### Customers (4 records)
- Sample customer profiles with contact information

### Orders (4 records)
- Completed birthday song order
- Processing business anthem
- Delivered college anthem
- Pending graduation song

### Samples (6 records)
- Audio samples across different genres (Pop, Corporate, Romantic, Institutional)

### Testimonials (6 records)
- 5-star customer reviews with placeholder photos

## 🔧 Manual Data Modification

### Adding New Users
When creating users through the API, passwords are automatically hashed. For manual insertion, use bcrypt to hash passwords:

```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('password123', 10);
```

### Order Status Values
Valid order statuses:
- `pending` - Order received, not started
- `processing` - Currently working on the song
- `completed` - Song finished, ready for delivery
- `delivered` - Song delivered to customer
- `cancelled` - Order cancelled

### Package Categories
Valid package categories:
- `Personal` - Individual use (birthdays, love songs)
- `Business` - Corporate branding
- `Institution` - Schools, colleges, organizations

## 🛠️ Troubleshooting

### Connection Issues
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check that your connection string is correct
- Verify database user permissions

### Import Errors
- Make sure MongoDB Database Tools are installed
- Check that the JSON files are valid
- Ensure the target database exists

### Authentication Issues
- Verify JWT_SECRET is set in environment variables
- Check that passwords in the JSON are properly hashed
- Ensure the user exists in the database

## 📈 Production Considerations

- Change default passwords before going live
- Set up proper database indexes for performance
- Configure MongoDB Atlas backup policies
- Set up monitoring and alerts
- Consider database scaling as your user base grows

## 🎯 Next Steps

1. Import the sample data
2. Start the backend server: `npm run server`
3. Start the frontend: `npm run dev`
4. Test the application at `http://localhost:5173`
5. Begin customizing the data for your specific needs