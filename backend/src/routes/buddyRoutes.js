const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  findBuddies,
  sendBuddyRequest,
  getBuddyRequests,
  respondToBuddyRequest,
  getConnectedBuddies,
  rateBuddy
} = require('../controllers/buddyController');

// All routes are protected
router.use(authMiddleware);

router.get('/find', findBuddies);
router.post('/request', sendBuddyRequest);
router.get('/requests', getBuddyRequests);
router.put('/requests/:requestId', respondToBuddyRequest);
router.get('/connections', getConnectedBuddies);
router.post('/rate', rateBuddy);

module.exports = router;
