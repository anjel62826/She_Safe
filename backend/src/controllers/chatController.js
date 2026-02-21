const ChatMessage = require('../models/ChatMessage');
const { detectUnsafeKeywords } = require('../utils/helpers');
const { generateChatbotResponse, getTravelSafetyTips } = require('../services/chatbotService');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, conversationId } = req.body;
    const senderId = req.userId;

    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver ID and message'
      });
    }

    const unsafeKeywords = detectUnsafeKeywords(message);

    const chatMessage = await ChatMessage.create({
      conversationId: conversationId || `conv_${senderId}_${receiverId}`,
      senderId,
      receiverId,
      message,
      unsafeKeywordsDetected: unsafeKeywords,
      isEmergency: unsafeKeywords.length > 0
    });

    res.status(201).json({
      success: true,
      message: 'Message sent',
      chatMessage,
      warnings: unsafeKeywords.length > 0 ? {
        unsafeKeywordsDetected: unsafeKeywords,
        message: 'Emergency keywords detected. Help is available.'
      } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId, page = 1, limit = 20 } = req.query;
    const userId = req.userId;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide conversation ID'
      });
    }

    const skip = (page - 1) * limit;
    const messages = await ChatMessage.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('senderId receiverId', 'firstName lastName profilePicture');

    const total = await ChatMessage.countDocuments({ conversationId });

    // Mark messages as read
    await ChatMessage.updateMany(
      { conversationId, receiverId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      messages: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

exports.chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    const botResponse = generateChatbotResponse(message, userId);

    res.status(200).json({
      success: true,
      botResponse: {
        message: botResponse.response,
        type: botResponse.type,
        suggestedActions: botResponse.suggestedActions,
        unsafeKeywordDetected: botResponse.unsafeKeywordsDetected || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in chatbot',
      error: error.message
    });
  }
};

exports.getTravelTips = async (req, res) => {
  try {
    const { destination, category } = req.query;

    const tips = require('../services/chatbotService').getTravelSafetyTips(destination);

    if (category && tips[category]) {
      return res.status(200).json({
        success: true,
        category,
        tips: tips[category],
        destination
      });
    }

    res.status(200).json({
      success: true,
      destination,
      categories: Object.keys(tips),
      tips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching travel tips',
      error: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ChatMessage.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking message as read',
      error: error.message
    });
  }
};
