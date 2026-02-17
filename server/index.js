const express = require('express');
const dotenv = require('dotenv');

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

// Configuration
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();
initCronJobs();

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/review', reviewRoutes);
// Test Route
app.get('/', (req, res) => {
  res.send('ExpertConnect Server is Running Successfully!');
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_chat", (bookingId) => {
    socket.join(bookingId);
    console.log(`User joined room: ${bookingId}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.bookingId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});