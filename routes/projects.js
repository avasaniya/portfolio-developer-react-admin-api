const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const verifyAdmin = require('../middleware/verifyAdmin');

// Get All Projects
// router.get('/', async (req, res) => {
//   const { data, error } = await supabase
//     .from('projects')
//     .select('*, categories(name)');
//   if (error) return res.status(500).json({ error: error.message , status: 'error' });
//   res.json({ data, status: 'success' });
// });

// Get All Projects
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*') // Remove categories(name)
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  res.json({ data, status: 'success' });
});

// Get Projects by Category
router.get('/category/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*') // Remove categories(name)
    .eq('category_id', req.params.id);
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  res.json({ data, status: 'success' });
});

// Add Project (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  const { data, error } = await supabase.from('projects').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  res.status(201).json({ data: data[0], status: 'success' });
});

// Edit Project (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('projects')
    .update(req.body)
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Project not found', status: 'error' });
  res.json({ data: data[0], status: 'success' });
});

// Delete Project (Admin only)
router.post('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message, status: 'error' });
  res.json({ message: 'Project deleted', status: 'success' });
});

module.exports = router;
