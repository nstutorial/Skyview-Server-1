const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from skyview-client directory
app.use(express.static(path.join(__dirname, '../skyview-client')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const academicRoutes = require('./routes/academic');
const classRoutes = require('./routes/classes'); 
const studentsRoutes = require('./routes/students');
const marksRoutes = require('./routes/marks');
const sectionRoutes = require('./routes/section.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/sections', sectionRoutes);

// Root endpoint for API health check
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Skyview School API' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack); 
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {} 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
