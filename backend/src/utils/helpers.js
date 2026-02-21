const generateToken = (id) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return regex.test(phone);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula to calculate distance between two coordinates
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const detectUnsafeKeywords = (message) => {
  const UNSAFE_KEYWORDS = require('../config/constants').UNSAFE_KEYWORDS;
  const detectedKeywords = [];
  const lowerMessage = message.toLowerCase();

  UNSAFE_KEYWORDS.forEach(keyword => {
    if (lowerMessage.includes(keyword)) {
      detectedKeywords.push(keyword);
    }
  });

  return detectedKeywords;
};

const formatUserResponse = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.digiLockerVerificationId;
  return userObj;
};

module.exports = {
  generateToken,
  validateEmail,
  validatePhone,
  calculateDistance,
  detectUnsafeKeywords,
  formatUserResponse
};
