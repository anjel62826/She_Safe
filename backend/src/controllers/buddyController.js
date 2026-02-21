const BuddyRequest = require('../models/BuddyRequest');
const BuddyConnection = require('../models/BuddyConnection');
const { calculateDistance, formatUserResponse } = require('../utils/helpers');
const DBAdapter = require('../db/dbAdapter');

exports.findBuddies = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, interests } = req.query;
    const userId = req.userId;

    // normalize interests (allow comma-separated)
    let interestsArr = [];
    if (Array.isArray(interests)) interestsArr = interests;
    else if (typeof interests === 'string' && interests.length) {
      interestsArr = interests.split(',').map(s => s.trim()).filter(Boolean);
    }

    // parse dates if provided
    const sDate = startDate ? new Date(startDate) : null;
    const eDate = endDate ? new Date(endDate) : null;

    // base user query
    let query = {
      _id: { $ne: userId },
      isVerified: true,
      isActive: true,
      isBanned: false
    };

    if (budget) query.budget = budget;
    if (interestsArr.length) query.interests = { $in: interestsArr };

    // candidates from user profile/travelHistory
    let candidates = await DBAdapter.findUsers(query, { limit: 50 });

    // also include users who have travel plans overlapping the requested dates and destination
    const addFromPlans = async () => {
      try {
        if (DBAdapter.isMockMode()) {
          const mockDB = require('../db/mockdb');
          const allPlans = mockDB.travelPlans.find({});
          const matchingPlans = allPlans.filter(p => {
            if (destination && p.destination && !(new RegExp(destination, 'i')).test(p.destination)) return false;
            if (sDate && eDate) {
              const pS = new Date(p.startDate);
              const pE = new Date(p.endDate);
              if (!(pS <= eDate && pE >= sDate)) return false;
            }
            return true;
          });

          for (const p of matchingPlans) {
            if (p.userId && p.userId !== userId) {
              const u = await DBAdapter.findUserById(p.userId);
              if (u) candidates.push(u);
            }
          }
        } else {
          const TravelPlan = require('../models/TravelPlan');
          const planQuery = {};
          if (destination) planQuery.destination = { $regex: destination, $options: 'i' };
          if (sDate && eDate) {
            planQuery.startDate = { $lte: eDate };
            planQuery.endDate = { $gte: sDate };
          }
          const plans = await TravelPlan.find(planQuery).limit(100).lean();
          const userIds = [...new Set(plans.map(p => String(p.userId)).filter(id => id && id !== String(userId)))];
          // fetch users
          const users = await DBAdapter.findUsers({ _id: { $in: userIds }, isVerified: true, isActive: true, isBanned: false });
          candidates = candidates.concat(users);
        }
      } catch (e) {
        // ignore plan-based augmentation errors
      }
    };

    await addFromPlans();

    // dedupe candidates by _id
    const seen = new Set();
    const final = [];
    for (const u of candidates) {
      const id = u._id ? String(u._id) : null;
      if (!id || id === String(userId)) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      final.push(u);
      if (final.length >= 20) break;
    }

    res.status(200).json({
      success: true,
      count: final.length,
      buddies: final.map(b => formatUserResponse(b))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding buddies',
      error: error.message
    });
  }
};

exports.sendBuddyRequest = async (req, res) => {
  try {
    const { toUserId, message, destination, startDate, endDate, travelType } = req.body;
    const fromUserId = req.userId;

    if (!toUserId || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if request already exists
    const existingRequest = await BuddyRequest.findOne({
      from: fromUserId,
      to: toUserId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Buddy request already pending with this user'
      });
    }

    const buddyRequest = await BuddyRequest.create({
      from: fromUserId,
      to: toUserId,
      message: message || 'Hi, would you like to be travel buddies?',
      destination,
      startDate,
      endDate,
      travelType
    });

    // Populate and return
    await buddyRequest.populate('from to', 'firstName lastName profilePicture isVerified');

    res.status(201).json({
      success: true,
      message: 'Buddy request sent successfully',
      buddyRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending buddy request',
      error: error.message
    });
  }
};

exports.getBuddyRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await BuddyRequest.find({ to: userId, status: 'pending' })
      .populate('from', 'firstName lastName profilePicture isVerified')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching buddy requests',
      error: error.message
    });
  }
};

exports.respondToBuddyRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const userId = req.userId;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be accepted or rejected'
      });
    }

    const buddyRequest = await BuddyRequest.findById(requestId);

    if (!buddyRequest || buddyRequest.to.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Buddy request not found'
      });
    }

    buddyRequest.status = status;
    buddyRequest.respondedAt = new Date();
    await buddyRequest.save();

    if (status === 'accepted') {
      // Create buddy connection
      const existingConnection = await BuddyConnection.findOne({
        $or: [
          { buddy1: buddyRequest.from, buddy2: buddyRequest.to },
          { buddy1: buddyRequest.to, buddy2: buddyRequest.from }
        ]
      });

      if (!existingConnection) {
        await BuddyConnection.create({
          buddy1: buddyRequest.from,
          buddy2: buddyRequest.to
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Buddy request ${status} successfully`,
      buddyRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error responding to buddy request',
      error: error.message
    });
  }
};

exports.getConnectedBuddies = async (req, res) => {
  try {
    const userId = req.userId;

    const connections = await BuddyConnection.find({
      $or: [{ buddy1: userId }, { buddy2: userId }]
    }).populate('buddy1 buddy2', 'firstName lastName profilePicture isVerified');

    const buddies = connections.map(conn => {
      return conn.buddy1._id.toString() === userId ? conn.buddy2 : conn.buddy1;
    });

    res.status(200).json({
      success: true,
      count: buddies.length,
      buddies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching connected buddies',
      error: error.message
    });
  }
};

exports.rateBuddy = async (req, res) => {
  try {
    const { buddyId, rating, review } = req.body;
    const userId = req.userId;

    if (!buddyId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid rating (1-5) and buddy ID'
      });
    }

    const connection = await BuddyConnection.findOneAndUpdate(
      {
        $or: [
          { buddy1: userId, buddy2: buddyId },
          { buddy1: buddyId, buddy2: userId }
        ]
      },
      {
        rating,
        review
      },
      { new: true }
    ).populate('buddy1 buddy2', 'firstName lastName');

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Buddy connection not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rating buddy',
      error: error.message
    });
  }
};
