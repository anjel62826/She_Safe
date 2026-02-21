// Database adapter - routes to real MongoDB or mock DB based on availability
const { getMockMode, getMockDB } = require('../config/database');
const User = require('../models/User');
const mockDB = require('../db/mockdb');

class DBAdapter {
  // Check if using mock mode
  static isMockMode() {
    try {
      return getMockMode();
    } catch {
      return true;
    }
  }

  // User operations
  static async createUser(userData) {
    if (this.isMockMode()) {
      // Hash password in mock mode
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      return mockDB.users.create({ ...userData, password: hashedPassword });
    }
    return await User.create(userData);
  }

  static async findUserByEmail(email) {
    if (this.isMockMode()) {
      return mockDB.users.findOne({ email });
    }
    return await User.findOne({ email });
  }

  static async findUserById(id) {
    if (this.isMockMode()) {
      return mockDB.users.findById(id);
    }
    return await User.findById(id);
  }

  static async findUsers(query, options = {}) {
    if (this.isMockMode()) {
      const arr = mockDB.users.find(query || {});
      if (options.limit) return arr.slice(0, options.limit);
      return arr;
    }
    let q = User.find(query || {});
    if (options.limit) q = q.limit(options.limit);
    return await q;
  }

  static async findUserByEmailWithPassword(email) {
    if (this.isMockMode()) {
      return mockDB.users.findOne({ email });
    }
    return await User.findOne({ email }).select('+password');
  }

  static async updateUser(query, updateData) {
    if (this.isMockMode()) {
      return mockDB.users.updateOne(query, { $set: updateData });
    }
    return await User.updateOne(query, { $set: updateData });
  }

  // Buddy operations
  static async createBuddyRequest(data) {
    if (this.isMockMode()) {
      return mockDB.buddyRequests.create(data);
    }
    const BuddyRequest = require('../models/BuddyRequest');
    return await BuddyRequest.create(data);
  }

  static async findBuddyRequest(query) {
    if (this.isMockMode()) {
      return mockDB.buddyRequests.findOne(query);
    }
    const BuddyRequest = require('../models/BuddyRequest');
    return await BuddyRequest.findOne(query);
  }

  static async findBuddyRequests(query) {
    if (this.isMockMode()) {
      return mockDB.buddyRequests.find(query);
    }
    const BuddyRequest = require('../models/BuddyRequest');
    return await BuddyRequest.find(query);
  }

  static async updateBuddyRequest(query, updateData) {
    if (this.isMockMode()) {
      return mockDB.buddyRequests.updateOne(query, { $set: updateData });
    }
    const BuddyRequest = require('../models/BuddyRequest');
    return await BuddyRequest.updateOne(query, { $set: updateData });
  }

  // Blog operations
  static async createBlog(data) {
    if (this.isMockMode()) {
      return mockDB.blogs.create(data);
    }
    const Blog = require('../models/Blog');
    return await Blog.create(data);
  }

  static async findBlog(query) {
    if (this.isMockMode()) {
      return mockDB.blogs.findOne(query);
    }
    const Blog = require('../models/Blog');
    return await Blog.findOne(query);
  }

  static async findBlogs(query) {
    if (this.isMockMode()) {
      return mockDB.blogs.find(query);
    }
    const Blog = require('../models/Blog');
    return await Blog.find(query);
  }

  static async updateBlog(query, updateData) {
    if (this.isMockMode()) {
      return mockDB.blogs.updateOne(query, { $set: updateData });
    }
    const Blog = require('../models/Blog');
    return await Blog.updateOne(query, { $set: updateData });
  }

  // Emergency operations
  static async createEmergencyAlert(data) {
    if (this.isMockMode()) {
      return mockDB.emergencyAlerts.create(data);
    }
    const EmergencyAlert = require('../models/EmergencyAlert');
    return await EmergencyAlert.create(data);
  }

  static async findEmergencyAlerts(query) {
    if (this.isMockMode()) {
      return mockDB.emergencyAlerts.find(query);
    }
    const EmergencyAlert = require('../models/EmergencyAlert');
    return await EmergencyAlert.find(query);
  }

  // Chat operations
  static async createMessage(data) {
    if (this.isMockMode()) {
      return mockDB.messages.create(data);
    }
    const ChatMessage = require('../models/ChatMessage');
    return await ChatMessage.create(data);
  }

  static async findMessages(query) {
    if (this.isMockMode()) {
      return mockDB.messages.find(query);
    }
    const ChatMessage = require('../models/ChatMessage');
    return await ChatMessage.find(query);
  }

  static async updateMessage(query, updateData) {
    if (this.isMockMode()) {
      return mockDB.messages.updateOne(query, { $set: updateData });
    }
    const ChatMessage = require('../models/ChatMessage');
    return await ChatMessage.updateOne(query, { $set: updateData });
  }
}

module.exports = DBAdapter;
