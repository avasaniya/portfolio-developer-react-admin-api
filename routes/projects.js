const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const multer = require('multer');
const Project = require('../models/project');
const upload = multer();
 
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
router.post(
  '/',
  verifyAdmin,
  upload.single('screenshot'),
  async (req, res) => {
    try {
      let screenshots = [];

      // If a file is uploaded, save its info (you need to handle actual file storage)
      if (req.file) {
        // For now, just save the filename; implement actual storage as needed
        screenshots.push({
          url: `/uploads/${req.file.originalname}`,
          caption: req.body.caption || '',
        });
      }

      const projectData = {
        ...req.body,
        screenshots: screenshots.length > 0 ? screenshots : req.body.screenshots || [],
      };

      const project = new Project(projectData);
      await project.save();
      res.status(201).json({ data: project, status: 'success' });
    } catch (err) {
      res.status(500).json({ error: err.message, status: 'error' });
    }
  }
);

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