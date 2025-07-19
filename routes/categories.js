const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const Category = require('../models/Category');
 
// Get All Categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ data: categories, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});

// Add Category (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ data: category, status: 'success' });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({
        error: 'A category with this name already exists.',
        status: 'error'
      });
    } else {
      // Handle other errors
      res.status(500).json({
        error: error.message,
        status: 'error'
      });
    }
  }
});


// Edit Category (Admin only)
router.post('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found', status: 'error' });
    res.json({ data: category, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});

// Delete Category (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted', status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});

// Get Items by Category ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const items = await Category.find({ _id: id });
    res.json({ data: items, status: 'success', message: 'Items fetched successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});

module.exports = router;