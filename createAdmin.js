const bcrypt = require('bcryptjs');
const connectDB = require('./mongoClient');
const Admin = require('./models/Admin');
const mongoose = require('mongoose');

async function createAdmin(email, plainPassword) {
  try {
    await connectDB();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('✅ Admin already exists:', email);
      return existingAdmin;
    }

    // Insert into MongoDB using Mongoose model
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    console.log('✅ Admin created with ID:', newAdmin._id);
    return newAdmin;
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    await createAdmin('admin@example.com', 'admin123');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error);
    process.exit(1);
  }
})();
