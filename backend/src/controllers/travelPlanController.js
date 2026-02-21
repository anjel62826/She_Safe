const DBAdapter = require('../db/dbAdapter');

// Create a new travel plan
exports.createTravelPlan = async (req, res) => {
  try {
    const { destination, startDate, endDate, description, budget, travelType } = req.body;
    const userId = req.userId;

    // Validation
    if (!destination || !startDate || !endDate || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: destination, startDate, endDate, budget'
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Create travel plan object
    const travelPlanData = {
      userId,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description: description || '',
      budget,
      travelType: travelType || 'solo',
      buddies: []
    };

    // Store in mock DB or real DB
    const mockDB = require('../db/mockdb');
    let travelPlan;
    
    if (mockDB.travelPlans && typeof mockDB.travelPlans.create === 'function') {
      // Using mock database with create method
      travelPlan = mockDB.travelPlans.create(travelPlanData);
    } else {
      // Fallback if structure is different
      travelPlan = {
        _id: `plan_${Date.now()}`,
        ...travelPlanData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      if (!mockDB.travelPlans) {
        mockDB.travelPlans = [];
      }
      if (Array.isArray(mockDB.travelPlans)) {
        mockDB.travelPlans.push(travelPlan);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Travel plan created successfully',
      travelPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating travel plan',
      error: error.message
    });
  }
};

// Get user's travel plans
exports.getUserTravelPlans = async (req, res) => {
  try {
    const userId = req.userId;
    const mockDB = require('../db/mockdb');

    let travelPlans = [];
    if (mockDB.travelPlans && typeof mockDB.travelPlans.findByUserId === 'function') {
      travelPlans = mockDB.travelPlans.findByUserId(userId);
    } else if (mockDB.travelPlans) {
      travelPlans = mockDB.travelPlans.find({ userId });
    }

    travelPlans.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    res.status(200).json({
      success: true,
      count: travelPlans.length,
      travelPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching travel plans',
      error: error.message
    });
  }
};

// Get all travel plans for buddy matching (with user details)
exports.getAllTravelPlans = async (req, res) => {
  try {
    const { destination, budget, startDate, endDate } = req.query;
    const mockDB = require('../db/mockdb');

    let travelPlans = [];
    if (mockDB.travelPlans && typeof mockDB.travelPlans.find === 'function') {
      travelPlans = mockDB.travelPlans.find({});
    }

    // Filter by destination
    if (destination) {
      travelPlans = travelPlans.filter(plan =>
        plan.destination.toLowerCase().includes(destination.toLowerCase())
      );
    }

    // Filter by budget
    if (budget) {
      travelPlans = travelPlans.filter(plan => plan.budget === budget);
    }

    // Filter by date range
    if (startDate) {
      travelPlans = travelPlans.filter(plan =>
        new Date(plan.startDate) >= new Date(startDate)
      );
    }

    if (endDate) {
      travelPlans = travelPlans.filter(plan =>
        new Date(plan.endDate) <= new Date(endDate)
      );
    }

    // Sort by start date
    travelPlans.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Add user details
    const plansWithUsers = travelPlans.map(plan => {
      const user = mockDB.users.findOne({ _id: plan.userId });
      return {
        ...plan,
        user: user ? {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePhoto: user.profilePhoto,
          isVerified: user.isVerified
        } : null
      };
    });

    res.status(200).json({
      success: true,
      count: plansWithUsers.length,
      travelPlans: plansWithUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching travel plans',
      error: error.message
    });
  }
};

// Get single travel plan
exports.getTravelPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const mockDB = require('../db/mockdb');

    let travelPlan = null;
    if (mockDB.travelPlans && typeof mockDB.travelPlans.find === 'function') {
      const results = mockDB.travelPlans.find({ _id: planId });
      travelPlan = results.length > 0 ? results[0] : null;
    }

    if (!travelPlan) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found'
      });
    }

    // Add user details
    const user = mockDB.users.findOne({ _id: travelPlan.userId });
    const planWithUser = {
      ...travelPlan,
      user: user ? {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePhoto: user.profilePhoto,
        isVerified: user.isVerified
      } : null
    };

    res.status(200).json({
      success: true,
      travelPlan: planWithUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching travel plan',
      error: error.message
    });
  }
};

// Update travel plan
exports.updateTravelPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { destination, startDate, endDate, description, budget, travelType } = req.body;
    const userId = req.userId;
    const mockDB = require('../db/mockdb');

    if (!mockDB.travelPlans) {
      mockDB.travelPlans = [];
    }

    const planIndex = mockDB.travelPlans.findIndex(plan => plan._id === planId);

    if (planIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found'
      });
    }

    const travelPlan = mockDB.travelPlans[planIndex];

    // Verify ownership
    if (travelPlan.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this travel plan'
      });
    }

    // Update fields
    if (destination) travelPlan.destination = destination;
    if (startDate) travelPlan.startDate = new Date(startDate);
    if (endDate) travelPlan.endDate = new Date(endDate);
    if (description) travelPlan.description = description;
    if (budget) travelPlan.budget = budget;
    if (travelType) travelPlan.travelType = travelType;
    travelPlan.updatedAt = new Date();

    mockDB.travelPlans[planIndex] = travelPlan;

    res.status(200).json({
      success: true,
      message: 'Travel plan updated successfully',
      travelPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating travel plan',
      error: error.message
    });
  }
};

// Delete travel plan
exports.deleteTravelPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.userId;
    const mockDB = require('../db/mockdb');

    if (!mockDB.travelPlans) {
      mockDB.travelPlans = [];
    }

    const planIndex = mockDB.travelPlans.findIndex(plan => plan._id === planId);

    if (planIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found'
      });
    }

    const travelPlan = mockDB.travelPlans[planIndex];

    // Verify ownership
    if (travelPlan.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this travel plan'
      });
    }

    mockDB.travelPlans.splice(planIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Travel plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting travel plan',
      error: error.message
    });
  }
};
