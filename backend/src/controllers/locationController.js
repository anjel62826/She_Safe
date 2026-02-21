const LocationTracking = require('../models/LocationTracking');
const TravelPlan = require('../models/TravelPlan');
const { calculateDistance } = require('../utils/helpers');

exports.startLiveTracking = async (req, res) => {
  try {
    const { latitude, longitude, tripId } = req.body;
    const userId = req.userId;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates'
      });
    }

    const tracking = await LocationTracking.create({
      userId,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      tripId,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Live tracking started',
      tracking: {
        id: tracking._id,
        userId: tracking.userId,
        isActive: tracking.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting live tracking',
      error: error.message
    });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, accuracy, speed, heading } = req.body;
    const userId = req.userId;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates'
      });
    }

    const tracking = await LocationTracking.create({
      userId,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      accuracy,
      speed,
      heading,
      isActive: true
    });

    res.status(200).json({
      success: true,
      message: 'Location updated',
      tracking: {
        id: tracking._id,
        coordinates: tracking.location.coordinates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
};

exports.getLiveLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    const latestTracking = await LocationTracking.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!latestTracking) {
      return res.status(404).json({
        success: false,
        message: 'No location data found'
      });
    }

    res.status(200).json({
      success: true,
      location: {
        latitude: latestTracking.location.coordinates[1],
        longitude: latestTracking.location.coordinates[0],
        accuracy: latestTracking.accuracy,
        speed: latestTracking.speed,
        heading: latestTracking.heading,
        lastUpdated: latestTracking.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message
    });
  }
};

exports.shareLocation = async (req, res) => {
  try {
    const { shareWith, duration } = req.body; // shareWith: array of user IDs
    const userId = req.userId;

    if (!shareWith || !Array.isArray(shareWith) || shareWith.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide users to share location with'
      });
    }

    const tracking = await LocationTracking.findOne({ userId }).sort({ createdAt: -1 });

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: 'No active location tracking'
      });
    }

    // Add share recipients
    tracking.sharedWith = shareWith.map(id => ({ userId: id }));
    await tracking.save();

    res.status(200).json({
      success: true,
      message: `Location shared with ${shareWith.length} contacts`,
      sharedWith: shareWith.length,
      duration: duration || 'Until you stop sharing'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sharing location',
      error: error.message
    });
  }
};

exports.createTravelPlan = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, travelType, description, itinerary, safetyNotes } = req.body;
    const userId = req.userId;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide destination, start date, and end date'
      });
    }

    const travelPlan = await TravelPlan.create({
      userId,
      destination,
      startDate,
      endDate,
      budget: budget || 'mid-range',
      travelType: travelType || 'solo',
      description,
      itinerary: itinerary || [],
      safetyNotes: safetyNotes || [],
      status: 'planned'
    });

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

exports.getTravelPlans = async (req, res) => {
  try {
    const userId = req.userId;

    const plans = await TravelPlan.find({ userId })
      .populate('buddies.buddyId', 'firstName lastName profilePicture')
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching travel plans',
      error: error.message
    });
  }
};

exports.updateTravelPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;
    const userId = req.userId;

    const plan = await TravelPlan.findOneAndUpdate(
      { _id: planId, userId },
      updates,
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Travel plan updated',
      plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating travel plan',
      error: error.message
    });
  }
};
