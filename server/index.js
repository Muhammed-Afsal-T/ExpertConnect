const express = require('express');
const dotenv = require('dotenv');

// Load environment variables before importing modules that depend on them.
dotenv.config();

const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const initCronJobs = require('./utils/cronJobs');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Configuration
const app = express();
const server = http.createServer(app);

// Initialize core infrastructure at startup.
connectDB();
initCronJobs();

// Middleware
// Parse JSON request bodies before route handlers run.
app.use(express.json());
// Allow frontend app to call backend APIs across origins.
app.use(cors());

// API route groups.
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/payment', paymentRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('ExpertConnect Server is Running Successfully!');
});

const io = new Server(server, {
  cors: {
    // Restrict socket connections to frontend origin.
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  // Join a room scoped to a booking so messages stay session-specific.
  socket.on("join_chat", (bookingId) => {
    socket.join(bookingId);
  });

  // Broadcast incoming message to all other clients in the same booking room.
  socket.on("send_message", (data) => {
    socket.to(data.bookingId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
