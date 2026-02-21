const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  chatWithBot,
  getTravelTips,
  markAsRead
} = require('../controllers/chatController');

// Public routes - no auth needed for tips
router.get('/tips', getTravelTips);

// Protected routes
router.use(authMiddleware);
router.post('/send', sendMessage);
router.get('/messages', getMessages);
router.post('/bot', chatWithBot);
router.put('/messages/:messageId/read', markAsRead);

module.exports = router;
