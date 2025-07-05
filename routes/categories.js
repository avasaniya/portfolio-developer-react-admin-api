const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const verifyAdmin = require('../middleware/verifyAdmin');

// Get All Categories
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  res.json({ data, status: 'success' });
});

// Add Category (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, description } = req.body;
  const { data, error } = await supabase.from('categories').insert([{ name, description }]).select();
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  res.status(201).json({ data: data[0], status: 'success' });
});


// Edit Category (Admin only)
router.post('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const { data, error } = await supabase
    .from('categories')
    .update({ name, description })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Category not found', status: 'error' });
  res.json({ data: data[0], status: 'success' });
});


router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  res.json({ message: 'Category deleted', status: 'success' });
});

// Get Items by Category ID
router.get('/:id/items', async (req, res) => {
  const { id } = req.params;
  // Replace 'items' with your actual table name if different
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('category_id', id);
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  res.json({ data, status: 'success' });
});


module.exports = router;
