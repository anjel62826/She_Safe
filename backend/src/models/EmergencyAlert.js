const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['triggered', 'acknowledged', 'resolved', 'false_alarm'],
      default: 'triggered'
    },
    type: {
      type: String,
      enum: ['sos_button', 'unsafe_message', 'location_anomaly'],
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      },
      address: String
    },
    alertMessage: String,
    notifiedContacts: [
      {
        contactId: mongoose.Schema.Types.ObjectId,
        notificationMethod: {
          type: String,
          enum: ['sms', 'email', 'app_notification'],
          required: true
        },
        sentAt: {
          type: Date,
          default: Date.now
        },
        acknowledged: {
          type: Boolean,
          default: false
        }
      }
    ],
    nearbyPoliceStations: [
      {
        name: String,
        distance: Number,
        location: {
          latitude: Number,
          longitude: Number
        },
        phone: String
      }
    ],
    nearbyHospitals: [
      {
        name: String,
        distance: Number,
        location: {
          latitude: Number,
          longitude: Number
        }
      }
    ],
    responderNotes: String,
    resolvedAt: Date,
    resolvedBy: mongoose.Schema.Types.ObjectId,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create geospatial index
emergencyAlertSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);
