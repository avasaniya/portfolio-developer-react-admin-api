const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./mongoClient');
const verifyAdmin = require('./middleware/verifyAdmin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
 
// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/projects', require('./routes/projects'));

// Connect to MongoDB and start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
