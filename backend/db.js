const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set — add it to backend/.env');
  }
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');
}

module.exports = { connectDB };
