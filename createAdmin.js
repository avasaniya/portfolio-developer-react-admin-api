const bcrypt = require('bcryptjs');
const { connectDB, client } = require('./mongoClient');

async function createAdmin(email, plainPassword) {
  try {
    await connectDB();
    const db = client.db('portfolio'); // Replace with your database name
    const collection = db.collection('admins');

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Insert into MongoDB
    const result = await collection.insertOne({ email, password: hashedPassword });

    // Check if the insertion was successful
    if (result.insertedId) {
      console.log('✅ Admin created with ID:', result.insertedId);
      return { _id: result.insertedId, email, password: hashedPassword };
    } else {
      throw new Error('Failed to create admin: No inserted ID returned');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    await createAdmin('admin@example.com', 'admin123');
  } catch (error) {
    console.error('Failed to create admin:', error);
  }
})();
