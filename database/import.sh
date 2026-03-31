#!/bin/bash

# MongoDB Atlas Import Script
# This script imports sample data into your MongoDB Atlas database

# Load environment variables from .env file
if [ -f "../.env" ]; then
    export $(grep -v '^#' ../.env | xargs)
fi

# Use the MONGODB_URI from environment variables
MONGODB_URI="${MONGODB_URI:-mongodb+srv://username:password@cluster.mongodb.net/songcraft?retryWrites=true&w=majority}"
DATABASE_NAME="songcraft"

echo "🚀 Starting MongoDB Atlas data import..."
echo "Database: $DATABASE_NAME"
echo "URI: $MONGODB_URI"
echo ""

# Check if mongoimport is installed
MONGOIMPORT_PATH="../mongodb-database-tools-ubuntu2204-x86_64-100.9.4/bin/mongoimport"
if [ ! -f "$MONGOIMPORT_PATH" ]; then
    echo "❌ mongoimport not found at $MONGOIMPORT_PATH"
    echo "Please ensure MongoDB Database Tools are downloaded and extracted."
    exit 1
fi

# Import each collection
echo "📦 Importing packages..."
"$MONGOIMPORT_PATH" --uri="$MONGODB_URI" --db="$DATABASE_NAME" --collection="packages" --file="database/packages.json" --jsonArray

echo "👥 Importing users..."
"$MONGOIMPORT_PATH" --uri="$MONGODB_URI" --db="$DATABASE_NAME" --collection="users" --file="database/users.json" --jsonArray

echo "🛒 Importing customers..."
"$MONGOIMPORT_PATH" --uri="$MONGODB_URI" --db="$DATABASE_NAME" --collection="customers" --file="database/customers.json" --jsonArray

echo "📋 Importing orders..."
"$MONGOIMPORT_PATH" --uri="$MONGODB_URI" --db="$DATABASE_NAME" --collection="orders" --file="database/orders.json" --jsonArray

echo "🎵 Importing samples..."
"$MONGOIMPORT_PATH" --uri="$MONGODB_URI" --db="$DATABASE_NAME" --collection="samples" --file="database/samples.json" --jsonArray

echo "💬 Importing testimonials..."
"$MONGOIMPORT_PATH" --uri="$MONGODB_URI" --db="$DATABASE_NAME" --collection="testimonials" --file="database/testimonials.json" --jsonArray

echo ""
echo "✅ Import completed!"
echo ""
echo "📊 Sample Data Summary:"
echo "   • 3 Packages (Personal, Business, Institution)"
echo "   • 3 Users (1 admin, 2 regular users)"
echo "   • 4 Customers"
echo "   • 4 Orders (various statuses)"
echo "   • 6 Audio Samples"
echo "   • 6 Testimonials"
echo ""
echo "🔐 Default Login Credentials:"
echo "   Admin: admin@songcraft.com / password123"
echo "   User: john.doe@example.com / password123"
echo ""
echo "🎯 Next Steps:"
echo "   1. Update MONGODB_URI in .env with your actual connection string"
echo "   2. Start the backend server: npm run server"
echo "   3. Start the frontend: npm run dev"
echo "   4. Visit http://localhost:5173 and login!"