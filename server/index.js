const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get("/",(req,res)=>{
  res.json({
    success:true,
    message:"Backend is Working!"
  })
})
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/roadmaps', require('./routes/roadmaps'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/community', require('./routes/community'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection & Admin Seed
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@campusbridge.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@campusbridge.com',
        password: '12345678',
        role: 'admin'
      });
      console.log('Admin user seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    seedAdmin();
  })
  .catch(err => console.log('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
