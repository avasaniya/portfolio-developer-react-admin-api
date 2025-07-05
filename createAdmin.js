const bcrypt = require('bcryptjs');
const supabase = require('./supabaseClient');

async function createAdmin() {
  const email = 'admin@example.com';
  const plainPassword = 'admin123';

  // 1. Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 2. Insert into Supabase
  const { data, error } = await supabase.from('admins').insert([
    {
      email,
      password: hashedPassword,
    },
  ]);

  if (error) {
    console.error('❌ Error creating admin:', error.message);
  } else {
    console.log('✅ Admin created:', data);
  }
}

createAdmin();
