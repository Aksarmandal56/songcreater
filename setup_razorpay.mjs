import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: '/www/wwwroot/songcreater/.env' });

const gwSchema = new mongoose.Schema({
  name: String, display_name: String, key_id: String, key_secret: String,
  webhook_secret: String, is_active: Boolean, is_test_mode: Boolean,
  created_at: Date, updated_at: Date
}, { collection: 'paymentgateways' });

async function setup() {
  await mongoose.connect(process.env.MONGODB_URI);
  const GW = mongoose.model('PaymentGateway', gwSchema);
  const exists = await GW.findOne({ name: 'razorpay' });
  if (exists) {
    await GW.updateOne({ name: 'razorpay' }, {
      $set: {
        key_id: 'rzp_test_YourTestKeyId',
        key_secret: 'YourTestKeySecret',
        display_name: 'Razorpay (Sandbox)',
        is_active: true,
        is_test_mode: true,
        updated_at: new Date()
      }
    });
    console.log('Updated existing Razorpay gateway');
  } else {
    await new GW({
      name: 'razorpay',
      display_name: 'Razorpay (Sandbox)',
      key_id: 'rzp_test_YourTestKeyId',
      key_secret: 'YourTestKeySecret',
      webhook_secret: 'webhook_secret_sandbox',
      is_active: true,
      is_test_mode: true,
      created_at: new Date(),
      updated_at: new Date()
    }).save();
    console.log('Created Razorpay sandbox gateway');
  }
  const gw = await GW.findOne({ name: 'razorpay' });
  console.log('Gateway:', JSON.stringify({ name: gw.name, key_id: gw.key_id, is_active: gw.is_active, is_test_mode: gw.is_test_mode }));
  await mongoose.disconnect();
}
setup().catch(console.error);
