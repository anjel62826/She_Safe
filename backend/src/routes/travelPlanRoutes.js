const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createTravelPlan,
  getUserTravelPlans,
  getAllTravelPlans,
  getTravelPlan,
  updateTravelPlan,
  deleteTravelPlan
} = require('../controllers/travelPlanController');

// All routes are protected
router.use(authMiddleware);

// Create travel plan
router.post('/', createTravelPlan);

// Get user's travel plans
router.get('/my-plans', getUserTravelPlans);

// Get all travel plans (for buddy matching)
router.get('/all', getAllTravelPlans);

// Get single travel plan
router.get('/:planId', getTravelPlan);

// Update travel plan
router.put('/:planId', updateTravelPlan);

// Delete travel plan
router.delete('/:planId', deleteTravelPlan);

module.exports = router;
