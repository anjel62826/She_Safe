// Mock in-memory database for offline development
const mockUsers = new Map();
const mockBuddyRequests = new Map();
const mockBlogs = new Map();
const mockEmergencyAlerts = new Map();
const mockChats = new Map();

let idCounter = {
  user: 1000,
  buddy: 2000,
  blog: 3000,
  emergency: 4000,
  chat: 5000,
  plan: 6000
};


const mockDB = {
  // User operations
  users: {
    create: (userData) => {
      const id = `${idCounter.user++}`;
      const user = { _id: id, ...userData, createdAt: new Date() };
      mockUsers.set(id, user);
      return user;
    },
    findOne: (query) => {
      for (let user of mockUsers.values()) {
        if (query.email && user.email === query.email) return user;
        if (query._id && user._id === query._id) return user;
      }
      return null;
    },
    find: (query) => {
      const results = [];
      const regexMatch = (val, pattern) => {
        try {
          return new RegExp(pattern, 'i').test(val || '');
        } catch (e) {
          return false;
        }
      };

      for (let user of mockUsers.values()) {
        let ok = true;

        if (query._id && typeof query._id === 'object' && query._id.$ne) {
          if (user._id === query._id.$ne) ok = false;
        } else if (query._id && user._id !== query._id) {
          ok = false;
        }

        if (query.isVerified !== undefined && user.isVerified !== query.isVerified) ok = false;
        if (query.isActive !== undefined && user.isActive !== query.isActive) ok = false;
        if (query.isBanned !== undefined && user.isBanned !== query.isBanned) ok = false;

        if (query['travelHistory.destination']) {
          const pattern = query['travelHistory.destination'].$regex || query['travelHistory.destination'];
          const found = (user.travelHistory || []).some(h => regexMatch(h.destination, pattern));
          if (!found) ok = false;
        }

        if (query.budget && user.budget !== query.budget) ok = false;

        if (query.interests && query.interests.$in) {
          const wanted = query.interests.$in;
          const userInterests = user.interests || [];
          const intersect = wanted.some(w => userInterests.includes(w));
          if (!intersect) ok = false;
        }

        if (ok) results.push(user);
      }

      return results;
    },
    findById: (id) => mockUsers.get(id) || null,
    updateOne: (query, update) => {
      const user = mockDB.users.findOne(query);
      if (user) {
        Object.assign(user, update.$set || update);
        mockUsers.set(user._id, user);
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    }
  },

  // Buddy operations
  buddyRequests: {
    create: (data) => {
      const id = `${idCounter.buddy++}`;
      const req = { _id: id, ...data, createdAt: new Date() };
      mockBuddyRequests.set(id, req);
      return req;
    },
    findOne: (query) => {
      for (let req of mockBuddyRequests.values()) {
        if (query._id && req._id === query._id) return req;
        if (query.from && query.to && req.from === query.from && req.to === query.to) return req;
      }
      return null;
    },
    find: (query) => Array.from(mockBuddyRequests.values()).filter(req => {
      if (query.to) return req.to === query.to;
      if (query.from) return req.from === query.from;
      return true;
    }),
    updateOne: (query, update) => {
      const req = mockDB.buddyRequests.findOne(query);
      if (req) {
        Object.assign(req, update.$set || update);
        mockBuddyRequests.set(req._id, req);
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    }
  },

  // Blog operations
  blogs: {
    create: (data) => {
      const id = `${idCounter.blog++}`;
      const blog = { _id: id, ...data, createdAt: new Date() };
      mockBlogs.set(id, blog);
      return blog;
    },
    findOne: (query) => {
      for (let blog of mockBlogs.values()) {
        if (query._id && blog._id === query._id) return blog;
      }
      return null;
    },
    find: (query) => Array.from(mockBlogs.values()),
    findById: (id) => mockBlogs.get(id) || null,
    updateOne: (query, update) => {
      const blog = mockDB.blogs.findOne(query);
      if (blog) {
        Object.assign(blog, update.$set || update);
        mockBlogs.set(blog._id, blog);
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    }
  },

  // Emergency operations
  emergencyAlerts: {
    create: (data) => {
      const id = `${idCounter.emergency++}`;
      const alert = { _id: id, ...data, createdAt: new Date() };
      mockEmergencyAlerts.set(id, alert);
      return alert;
    },
    findOne: (query) => {
      for (let alert of mockEmergencyAlerts.values()) {
        if (query._id && alert._id === query._id) return alert;
      }
      return null;
    },
    find: (query) => Array.from(mockEmergencyAlerts.values()).filter(alert => {
      if (query.userId) return alert.userId === query.userId;
      return true;
    })
  },

  // Chat operations
  messages: {
    create: (data) => {
      const id = `${idCounter.chat++}`;
      const msg = { _id: id, ...data, createdAt: new Date() };
      mockChats.set(id, msg);
      return msg;
    },
    find: (query) => Array.from(mockChats.values()).filter(msg => {
      if (query.conversationId) return msg.conversationId === query.conversationId;
      if (query.from) return msg.from === query.from;
      return true;
    }),
    updateOne: (query, update) => {
      const msg = Array.from(mockChats.values()).find(m => m._id === query._id);
      if (msg) {
        Object.assign(msg, update.$set || update);
        mockChats.set(msg._id, msg);
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    }
  },

  // Travel plans
  travelPlans: {
    create: (data) => {
      const id = `plan_${idCounter.plan++}`;
      const plan = { _id: id, ...data, createdAt: new Date(), updatedAt: new Date() };
      // attach to a simple map stored on this object
      if (!mockDB._plans) mockDB._plans = new Map();
      mockDB._plans.set(id, plan);
      return plan;
    },
    find: (query) => {
      if (!mockDB._plans) return [];
      return Array.from(mockDB._plans.values()).filter(p => {
        if (query.userId) return p.userId === query.userId;
        if (query._id) return p._id === query._id;
        return true;
      });
    },
    findByUserId: (userId) => {
      if (!mockDB._plans) return [];
      return Array.from(mockDB._plans.values()).filter(p => p.userId === userId);
    },
    updateOne: (query, update) => {
      if (!mockDB._plans) return { modifiedCount: 0 };
      const plan = Array.from(mockDB._plans.values()).find(p => p._id === query._id);
      if (plan) {
        Object.assign(plan, update.$set || update);
        plan.updatedAt = new Date();
        mockDB._plans.set(plan._id, plan);
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    }
  },

  // Clear function for testing
  clear: () => {
    mockUsers.clear();
    mockBuddyRequests.clear();
    mockBlogs.clear();
    mockEmergencyAlerts.clear();
    mockChats.clear();
  }
};

// Seed some mock users and travel plans to help buddy search during development
(() => {
  try {
    const u1 = mockDB.users.create({
      firstName: 'Alice',
      lastName: 'W',
      email: 'alice@example.com',
      phone: '1112223333',
      isVerified: true,
      isActive: true,
      isBanned: false,
      budget: 'mid-range',
      interests: ['culture', 'food'],
      travelHistory: [ { destination: 'Paris', startDate: '2026-03-14', endDate: '2026-03-20' } ]
    });

    const u2 = mockDB.users.create({
      firstName: 'Bob',
      lastName: 'K',
      email: 'bob@example.com',
      phone: '2223334444',
      isVerified: true,
      isActive: true,
      isBanned: false,
      budget: 'mid-range',
      interests: ['photography', 'culture'],
      travelHistory: [ { destination: 'Paris', startDate: '2026-03-16', endDate: '2026-03-23' } ]
    });

    mockDB.travelPlans.create({ userId: u1._id, destination: 'Paris', startDate: '2026-03-14', endDate: '2026-03-20', budget: 'mid-range', travelType: 'solo', description: 'Sightseeing' });
    mockDB.travelPlans.create({ userId: u2._id, destination: 'Paris', startDate: '2026-03-16', endDate: '2026-03-23', budget: 'mid-range', travelType: 'group', description: 'Photo trip' });
  } catch (e) {
    // ignore seeding errors
  }
})();

module.exports = mockDB;
