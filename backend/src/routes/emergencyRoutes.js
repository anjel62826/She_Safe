const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  triggerEmergency,
  getNearbyLocations,
  getEmergencyAlerts,
  resolveEmergency,
  getEmergencyNumbers
} = require('../controllers/emergencyController');

router.get('/numbers', getEmergencyNumbers);
router.get('/nearby', getNearbyLocations);

// Protected routes
router.use(authMiddleware);
router.post('/trigger', triggerEmergency);
router.get('/alerts', getEmergencyAlerts);
router.put('/alerts/:alertId/resolve', resolveEmergency);

module.exports = router;
