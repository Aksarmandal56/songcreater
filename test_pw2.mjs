import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '/www/wwwroot/songcreater/.env' });
await mongoose.connect(process.env.MONGODB_URI);
const users = await mongoose.connection.db.collection('users').find({}).toArray();
for (const u of users) {
  const test = await bcrypt.compare('password', u.password);
  console.log(`${u.email} (${u.role}) - "password": ${test}`);
}
process.exit(0);
