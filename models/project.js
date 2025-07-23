const mongoose = require('mongoose');

 
// Define project schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // Additional field for project description
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['planning', 'in-progress', 'completed', 'on-hold'], default: 'planning', index: true },
  startDate: { type: Date },
  endDate: { type: Date },
  tags: [{ type: String }],
  projectUrl: { type: String },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  images: [{ type: String }] 
});

// Middleware to update the `updatedAt` field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
