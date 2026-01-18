const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Import DB connection
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
// Configuration
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/message', messageRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('ExpertConnect Server is Running Successfully!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 