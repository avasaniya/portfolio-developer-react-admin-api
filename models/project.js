const mongoose = require('mongoose');

const screenshotSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  screenshots: [screenshotSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['planning', 'in-progress', 'completed', 'on-hold'], default: 'planning' },
  startDate: { type: Date },
  endDate: { type: Date },
  budget: { type: Number },
  projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  client: { type: String },
  clientContact: { type: String },
  projectUrl: { type: String },
  repositoryUrl: { type: String },
  isActive: { type: Boolean, default: true }
});

// Middleware to update the `updatedAt` field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
