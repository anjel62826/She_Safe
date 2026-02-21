const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  signup,
  login,
  verifyWithDigiLocker,
  oauthLogin,
  getProfile,
  updateProfile
} = require('../controllers/authController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/oauth-login', oauthLogin);

// Protected routes
router.post('/verify-digilocker', authMiddleware, verifyWithDigiLocker);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
