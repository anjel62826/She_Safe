const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  startLiveTracking,
  updateLocation,
  getLiveLocation,
  shareLocation,
  createTravelPlan,
  getTravelPlans,
  updateTravelPlan
} = require('../controllers/locationController');

// All routes are protected
router.use(authMiddleware);

// Live tracking
router.post('/tracking/start', startLiveTracking);
router.post('/tracking/update', updateLocation);
router.get('/tracking/:userId', getLiveLocation);
router.post('/tracking/share', shareLocation);

// Travel plans
router.post('/plans', createTravelPlan);
router.get('/plans', getTravelPlans);
router.put('/plans/:planId', updateTravelPlan);

module.exports = router;
