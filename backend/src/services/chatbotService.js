const detectUnsafeKeywords = require('../utils/helpers').detectUnsafeKeywords;

// Chatbot responses
const chatbotResponses = {
  default: "I'm here to help! Ask me about travel safety tips, emergency procedures, or how to find safe locations.",
  unsafe: "I detected some concerning keywords. Are you safe? I can help you trigger an emergency alert immediately.",
  help: "Help is available! Would you like me to: 1) Show nearby safe zones, 2) Send emergency alert, 3) Get police numbers?",
  directions: "I can help with safe routes. Please share your current location and destination.",
  buddies: "Looking for travel buddies? I can help you find verified women travelers with similar interests!"
};

const generateChatbotResponse = (message, userId) => {
  const lowerMessage = message.toLowerCase();
  const unsafeKeywords = detectUnsafeKeywords(message);

  if (unsafeKeywords.length > 0) {
    return {
      response: chatbotResponses.unsafe,
      type: 'warning',
      unsafeKeywordsDetected: unsafeKeywords,
      suggestedActions: ['trigger_emergency', 'show_nearby_zones', 'contact_police']
    };
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('emergency')) {
    return {
      response: chatbotResponses.help,
      type: 'info',
      suggestedActions: ['emergency_alert', 'nearby_locations', 'emergency_numbers']
    };
  }

  if (lowerMessage.includes('buddy') || lowerMessage.includes('companion')) {
    return {
      response: chatbotResponses.buddies,
      type: 'info',
      suggestedActions: ['find_buddies', 'view_requests']
    };
  }

  if (lowerMessage.includes('route') || lowerMessage.includes('safe') || lowerMessage.includes('direction')) {
    return {
      response: chatbotResponses.directions,
      type: 'info',
      suggestedActions: ['share_location', 'get_safe_routes']
    };
  }

  return {
    response: chatbotResponses.default,
    type: 'default',
    suggestedActions: ['ask_question']
  };
};

const getTravelSafetyTips = (destination) => {
  const tips = {
    general: [
      'Always share your itinerary with trusted contacts',
      'Keep emergency contacts saved in your phone',
      'Stay aware of your surroundings',
      'Trust your instincts',
      'Register with your embassy if traveling abroad',
      'Keep copies of important documents'
    ],
    transportation: [
      'Use official taxis or ride-sharing apps',
      'Avoid traveling alone at night',
      'Let someone know your travel schedule',
      'Avoid showing expensive items',
      'Book direct flights when possible'
    ],
    accommodation: [
      'Choose well-reviewed, established hotels',
      'Keep doors and windows locked',
      'Use hotel safes for valuables',
      'Know emergency exits',
      'Use peephole before opening doors'
    ],
    street_safety: [
      'Walk confidently and purposefully',
      'Keep valuables hidden',
      'Avoid poorly lit areas',
      'Stay in tourist areas when possible',
      'Learn basic phrases in local language',
      'Stay with groups when exploring'
    ]
  };

  return tips;
};

module.exports = {
  generateChatbotResponse,
  getTravelSafetyTips
};
