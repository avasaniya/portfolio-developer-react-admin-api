const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');
const verifyAdmin = require('../middleware/verifyAdmin');

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !admin) {
    return res.status(401).json({ error: 'Invalid email or password' , status: 'error' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' , status: 'error' });
  }

  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token, message: 'Login successful', admin: { id: admin.id, email: admin.email } , status: 'success' });
});

// 🔑 Change Password (POST)
router.post('/change-password', verifyAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // 1. Fetch admin from Supabase
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', req.admin.id)
    .single();

  if (error || !admin) return res.status(404).json({ error: 'Admin not found' });

  // 2. Compare current password
  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

  // 3. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. Update in Supabase
  const { error: updateError } = await supabase
    .from('admins')
    .update({ password: hashedPassword })
    .eq('id', req.admin.id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  res.json({ message: 'Password updated successfully' });
});

module.exports = router;
