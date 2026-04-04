import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
console.log('Connecting to MongoDB...');
await mongoose.connect(MONGO_URI);
console.log('Connected!');

// Get Package IDs first
const packageCol = mongoose.connection.db.collection('packages');
const packages = await packageCol.find({}).toArray();
if (packages.length === 0) {
  console.log('No packages found! Creating default packages...');
}
console.log(`Found ${packages.length} packages`);

const usersCol = mongoose.connection.db.collection('users');
const ordersCol = mongoose.connection.db.collection('orders');

// Remove old test users (not admin)
await usersCol.deleteMany({ email: { $ne: 'admin@songcraft.ai', $regex: /test|gmail|yahoo/ } });
console.log('Cleared old test users');

const testUsers = [
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com' },
  { name: 'Rahul Verma', email: 'rahul.verma@gmail.com' },
  { name: 'Anjali Singh', email: 'anjali.singh@yahoo.com' },
  { name: 'Vikram Patel', email: 'vikram.patel@gmail.com' },
  { name: 'Neha Gupta', email: 'neha.gupta@gmail.com' },
  { name: 'Amit Kumar', email: 'amit.kumar@yahoo.com' },
  { name: 'Sunita Rao', email: 'sunita.rao@gmail.com' },
  { name: 'Deepak Joshi', email: 'deepak.joshi@gmail.com' },
  { name: 'Kavita Mehta', email: 'kavita.mehta@yahoo.com' },
  { name: 'Arjun Nair', email: 'arjun.nair@gmail.com' },
];

const password = await bcrypt.hash('Test@1234', 10);
const statuses = ['pending', 'processing', 'completed', 'delivered'];
const musicStyles = ['Bollywood', 'Classical', 'Pop', 'Folk', 'Sufi'];
const languages = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu'];
const moods = ['Happy', 'Romantic', 'Sad', 'Energetic', 'Peaceful'];

let userCount = 0;
let orderCount = 0;

for (let i = 0; i < testUsers.length; i++) {
  const u = testUsers[i];
  
  // Insert user
  const userResult = await usersCol.insertOne({
    name: u.name,
    email: u.email,
    password,
    role: 'user',
    is_active: true,
    created_at: new Date(Date.now() - (i * 3 + Math.floor(Math.random()*5)) * 24*60*60*1000),
    updated_at: new Date()
  });
  userCount++;
  console.log(`Created user: ${u.name}`);

  // Create 2-3 orders per user
  const numOrders = 2 + (i % 2); // 2 or 3 orders
  for (let j = 0; j < numOrders; j++) {
    const ts = Date.now() + i * 1000 + j;
    const orderCode = `ORD-${ts}-${i}-${j}`;
    const pkg = packages.length > 0 ? packages[j % packages.length] : null;
    const daysAgo = (i * numOrders + j + 1) * 2;
    const deliveryDate = new Date(Date.now() + (3 + j) * 24*60*60*1000);
    
    await ordersCol.insertOne({
      order_code: orderCode,
      customer_name: u.name,
      customer_email: u.email,
      package_id: pkg ? pkg._id : new mongoose.Types.ObjectId(),
      package_name: pkg ? pkg.name : 'Standard Package',
      total_price: pkg ? pkg.price : (999 + j * 500),
      delivery_date: deliveryDate,
      story: `A ${moods[j % moods.length].toLowerCase()} song about ${u.name.split(' ')[0]}'s special moment`,
      music_style: musicStyles[(i + j) % musicStyles.length],
      singer_voice: j % 2 === 0 ? 'Male' : 'Female',
      mood: moods[(i + j) % moods.length],
      language: languages[i % languages.length],
      special_message: `With love from ${u.name}`,
      reference_song: '',
      status: statuses[(i + j) % statuses.length],
      created_at: new Date(Date.now() - daysAgo * 24*60*60*1000),
      updated_at: new Date()
    });
    orderCount++;
  }
  console.log(`  Added ${numOrders} orders for ${u.name}`);
}

console.log(`\nDone! Created ${userCount} users and ${orderCount} orders`);
await mongoose.disconnect();
