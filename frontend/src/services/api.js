import apiClient from './apiClient';

export const authService = {
  signup: async (userData) => {
    return apiClient.post('/auth/signup', userData);
  },

  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  oauthLogin: async (provider, token, profile) => {
    return apiClient.post('/auth/oauth-login', { provider, token, profile });
  },

  verifyDigiLocker: async (documentUrl, documentType) => {
    return apiClient.post('/auth/verify-digilocker', { documentUrl, documentType });
  },

  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },

  updateProfile: async (updates) => {
    return apiClient.put('/auth/profile', updates);
  }
};

export const buddyService = {
  findBuddies: async (filters) => {
    return apiClient.get('/buddy/find', { params: filters });
  },

  sendBuddyRequest: async (toUserId, message, destination, startDate, endDate, travelType) => {
    return apiClient.post('/buddy/request', {
      toUserId,
      message,
      destination,
      startDate,
      endDate,
      travelType
    });
  },

  getBuddyRequests: async () => {
    return apiClient.get('/buddy/requests');
  },

  respondToBuddyRequest: async (requestId, status) => {
    return apiClient.put(`/buddy/requests/${requestId}`, { status });
  },

  getConnectedBuddies: async () => {
    return apiClient.get('/buddy/connections');
  },

  rateBuddy: async (buddyId, rating, review) => {
    return apiClient.post('/buddy/rate', { buddyId, rating, review });
  }
};

export const blogService = {
  createBlog: async (blogData) => {
    return apiClient.post('/blog', blogData);
  },

  getBlog: async (blogId) => {
    return apiClient.get(`/blog/${blogId}`);
  },

  getAllBlogs: async (filters) => {
    return apiClient.get('/blog', { params: filters });
  },

  likeBlog: async (blogId) => {
    return apiClient.post(`/blog/${blogId}/like`);
  },

  commentBlog: async (blogId, text) => {
    return apiClient.post(`/blog/${blogId}/comment`, { text });
  },

  bookmarkBlog: async (blogId) => {
    return apiClient.post(`/blog/${blogId}/bookmark`);
  },

  getPopularDestinations: async () => {
    return apiClient.get('/blog/destinations/popular');
  }
};

export const emergencyService = {
  triggerEmergency: async (latitude, longitude, message, type) => {
    return apiClient.post('/emergency/trigger', {
      latitude,
      longitude,
      message,
      type
    });
  },

  getNearbyLocations: async (latitude, longitude, radius, type) => {
    return apiClient.get('/emergency/nearby', {
      params: { latitude, longitude, radius, type }
    });
  },

  getEmergencyAlerts: async () => {
    return apiClient.get('/emergency/alerts');
  },

  resolveEmergency: async (alertId, notes) => {
    return apiClient.put(`/emergency/alerts/${alertId}/resolve`, { notes });
  },

  getEmergencyNumbers: async () => {
    return apiClient.get('/emergency/numbers');
  }
};

export const locationService = {
  startLiveTracking: async (latitude, longitude, tripId) => {
    return apiClient.post('/location/tracking/start', {
      latitude,
      longitude,
      tripId
    });
  },

  updateLocation: async (latitude, longitude, accuracy, speed, heading) => {
    return apiClient.post('/location/tracking/update', {
      latitude,
      longitude,
      accuracy,
      speed,
      heading
    });
  },

  getLiveLocation: async (userId) => {
    return apiClient.get(`/location/tracking/${userId}`);
  },

  shareLocation: async (shareWith, duration) => {
    return apiClient.post('/location/tracking/share', {
      shareWith,
      duration
    });
  },

  createTravelPlan: async (planData) => {
    return apiClient.post('/location/plans', planData);
  },

  getTravelPlans: async () => {
    return apiClient.get('/location/plans');
  },

  updateTravelPlan: async (planId, updates) => {
    return apiClient.put(`/location/plans/${planId}`, updates);
  }
};

export const travelPlanService = {
  createTravelPlan: async (planData) => {
    return apiClient.post('/travel-plans', planData);
  },

  getUserTravelPlans: async () => {
    return apiClient.get('/travel-plans/my-plans');
  },

  getAllTravelPlans: async (filters) => {
    return apiClient.get('/travel-plans/all', { params: filters });
  },

  getTravelPlan: async (planId) => {
    return apiClient.get(`/travel-plans/${planId}`);
  },

  updateTravelPlan: async (planId, updates) => {
    return apiClient.put(`/travel-plans/${planId}`, updates);
  },

  deleteTravelPlan: async (planId) => {
    return apiClient.delete(`/travel-plans/${planId}`);
  }
};

export const chatService = {
  sendMessage: async (receiverId, message, conversationId) => {
    return apiClient.post('/chat/send', {
      receiverId,
      message,
      conversationId
    });
  },

  getMessages: async (conversationId, page, limit) => {
    return apiClient.get('/chat/messages', {
      params: { conversationId, page, limit }
    });
  },

  chatWithBot: async (message) => {
    return apiClient.post('/chat/bot', { message });
  },

  getTravelTips: async (destination, category) => {
    return apiClient.get('/chat/tips', {
      params: { destination, category }
    });
  },

  markAsRead: async (messageId) => {
    return apiClient.put(`/chat/messages/${messageId}/read`);
  }
};
