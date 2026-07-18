const mongoose = require('mongoose');

// Define project schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  short_description: { type: String, required: true },
  full_description: { type: String },
  features: [{ type: String }],
  tech_stack: [{ type: String }],
  role: { type: String },
  challenges: { type: String },
  learnings: { type: String },
  screenshots: [{
    url: { type: String },
    caption: { type: String }
  }],
  live_link: { type: String },
  github_link: { type: String },
  video_demo: { type: String },
  duration: { type: String },
  client_name: { type: String },
  testimonials: { type: String },
  future_plans: { type: String },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  
  // Legacy or additional fields
  description: { type: String },
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
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Middleware to update the `updatedAt` field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
