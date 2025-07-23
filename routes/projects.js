const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const multer = require('multer');
const Project = require('../models/project');
 const path = require('path'); // Add this line to import the path module

// Configure storage with destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where you want to save the files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize upload with the storage configuration
const upload = multer({ storage: storage });

// Get All Projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('category_id', 'name');
    res.json({ data: projects, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});

// Get Projects by Category
router.get('/category/:id', async (req, res) => {
  try {
    const projects = await Project.find({ category_id: req.params.id });
    res.json({ data: projects, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});

 // Add Project (Admin only) with image upload
router.post('/', verifyAdmin, upload.array('images'), async (req, res) => {
  try {
    console.log('Files received:', req.files); // Log received files
    const imagePaths = req.files.map(file => path.normalize(file.path).replace(/\\/g, '/')); // Normalize paths
    console.log('Image paths:', imagePaths); // Log image paths
    const projectData = {
      ...req.body,
      images: imagePaths, // Save the file paths to the database
    };
    const project = new Project(projectData);
    await project.save();
    res.status(201).json({ data: project, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'error' });
  }
});
// Edit Project (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found', status: 'error' });
    res.json({ data: project, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});

// Delete Project (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted', status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});

// Get Project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('category_id', 'name');
    if (!project) return res.status(404).json({ error: 'Project not found', status: 'error' });
    res.json({ data: project, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
});


module.exports = router;