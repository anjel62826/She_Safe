require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./config/database');

// Initialize Express
const app = express();
const server = http.createServer(app);

// CORS: Allow ALL origins (development mode)
const io = socketIo(server, {
  cors: {
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

// Middleware: Allow all CORS
app.use(cors({
  origin: '*',
  credentials: false,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buddy', require('./routes/buddyRoutes'));
app.use('/api/travel-plans', require('./routes/travelPlanRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'She_Safe API is running',
    timestamp: new Date()
  });
});

// Socket.io events for real-time features
const userSockets = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('user:connected', (userId) => {
    userSockets[userId] = socket.id;
    io.emit('user:online', userId);
  });

  socket.on('message:send', (data) => {
    const { receiverId, message } = data;
    if (userSockets[receiverId]) {
      io.to(userSockets[receiverId]).emit('message:receive', {
        senderId: data.senderId,
        message
      });
    }
  });

  socket.on('location:update', (data) => {
    const { userId, latitude, longitude } = data;
    io.emit('location:updated', {
      userId,
      location: { latitude, longitude },
      timestamp: new Date()
    });
  });

  socket.on('emergency:triggered', (data) => {
    io.emit('emergency:alert', {
      userId: data.userId,
      location: data.location,
      severity: data.severity
    });
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(userSockets)) {
      if (socketId === socket.id) {
        delete userSockets[userId];
        io.emit('user:offline', userId);
        break;
      }
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 She_Safe server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = { app, io };
