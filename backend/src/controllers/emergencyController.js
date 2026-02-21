const EmergencyAlert = require('../models/EmergencyAlert');
const User = require('../models/User');
const SafeZone = require('../models/SafeZone');
const { sendSMS, sendEmail, sendPushNotification } = require('../services/notificationService');
const { calculateDistance } = require('../utils/helpers');

exports.triggerEmergency = async (req, res) => {
  try {
    const { latitude, longitude, message, type } = req.body;
    const userId = req.userId;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates'
      });
    }

    const user = await User.findById(userId);

    // Create emergency alert
    const alert = await EmergencyAlert.create({
      userId,
      type: type || 'sos_button',
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      alertMessage: message || `Emergency alert from ${user.getFullName()}`,
      status: 'triggered',
      severity: 'high'
    });

    // Get nearby safe zones
    const nearbyZones = await SafeZone.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000 // 5km
        }
      }
    }).limit(5);

    alert.nearbyPoliceStations = nearbyZones
      .filter(z => z.type === 'police_station')
      .map(z => ({
        name: z.name,
        distance: calculateDistance(latitude, longitude, z.location.coordinates[1], z.location.coordinates[0]),
        location: {
          latitude: z.location.coordinates[1],
          longitude: z.location.coordinates[0]
        },
        phone: z.phone
      }));

    alert.nearbyHospitals = nearbyZones
      .filter(z => z.type === 'hospital')
      .map(z => ({
        name: z.name,
        distance: calculateDistance(latitude, longitude, z.location.coordinates[1], z.location.coordinates[0]),
        location: {
          latitude: z.location.coordinates[1],
          longitude: z.location.coordinates[0]
        }
      }));

    await alert.save();

    // Notify emergency contacts
    const emergencyContacts = user.emergencyContacts || [];

    for (const contact of emergencyContacts) {
      // Send SMS
      if (contact.phone) {
        await sendSMS(
          contact.phone,
          `EMERGENCY: ${user.getFullName()} has triggered an emergency alert at ${latitude}, ${longitude}. Location: [Add map link]. Please check on them immediately.`
        );
      }

      // Send Email
      if (contact.email) {
        const htmlContent = `
          <h2>EMERGENCY ALERT</h2>
          <p>${user.getFullName()} has triggered an emergency alert!</p>
          <p><strong>Location:</strong> ${latitude}, ${longitude}</p>
          <p><strong>Message:</strong> ${message || 'No additional message'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>Please check on them immediately.</p>
        `;
        await sendEmail(contact.email, 'EMERGENCY ALERT', htmlContent);
      }
    }

    // Also notify nearby police stations (mock)
    for (const station of alert.nearbyPoliceStations) {
      console.log(`[EMERGENCY] Notifying police station: ${station.name} at ${station.phone}`);
      await sendSMS(station.phone, `Emergency alert: Woman in distress at location ${latitude}, ${longitude}`);
    }

    res.status(201).json({
      success: true,
      message: 'Emergency alert triggered. Help is on the way!',
      alert: {
        alertId: alert._id,
        status: alert.status,
        nearbyPoliceStations: alert.nearbyPoliceStations.slice(0, 3),
        nearbyHospitals: alert.nearbyHospitals.slice(0, 2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error triggering emergency alert',
      error: error.message
    });
  }
};

exports.getNearbyLocations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5, type } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates'
      });
    }

    const radiusInMeters = radius * 1000;
    let query = {
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radiusInMeters
        }
      }
    };

    if (type) {
      query.type = type;
    }

    const locations = await SafeZone.find(query).limit(20);

    const formattedLocations = locations.map(loc => ({
      id: loc._id,
      name: loc.name,
      type: loc.type,
      address: loc.address,
      phone: loc.phone,
      distance: calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        loc.location.coordinates[1],
        loc.location.coordinates[0]
      ),
      rating: loc.rating,
      operatingHours: loc.operatingHours
    }));

    res.status(200).json({
      success: true,
      count: formattedLocations.length,
      locations: formattedLocations.sort((a, b) => a.distance - b.distance)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby locations',
      error: error.message
    });
  }
};

exports.getEmergencyAlerts = async (req, res) => {
  try {
    const userId = req.userId;

    const alerts = await EmergencyAlert.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency alerts',
      error: error.message
    });
  }
};

exports.resolveEmergency = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { notes } = req.body;
    const userId = req.userId;

    const alert = await EmergencyAlert.findByIdAndUpdate(
      alertId,
      {
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy: userId,
        responderNotes: notes
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Notify user that emergency is resolved
    const user = await User.findById(alert.userId);
    if (user.email) {
      await sendEmail(user.email, 'Your Emergency Alert Has Been Resolved', 
        `Your emergency alert has been marked as resolved. If you need further assistance, please contact us.`);
    }

    res.status(200).json({
      success: true,
      message: 'Emergency resolved',
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resolving emergency',
      error: error.message
    });
  }
};

exports.getEmergencyNumbers = async (req, res) => {
  try {
    const emergencyNumbers = {
      police: '100',
      ambulance: '102',
      fireService: '101',
      women_helpline: '1091',
      childAbuse: '1098',
      disaster_management: '108'
    };

    res.status(200).json({
      success: true,
      emergencyNumbers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency numbers',
      error: error.message
    });
  }
};
