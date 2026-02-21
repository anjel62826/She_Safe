const mongoose = require('mongoose');

const locationTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      }
    },
    address: String,
    accuracy: Number, // in meters
    speed: Number, // in km/h
    heading: Number, // in degrees
    sharedWith: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        sharedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelPlan'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
locationTrackingSchema.index({ 'location.coordinates': '2dsphere' });
// TTL index - automatically delete location records after 30 days
locationTrackingSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('LocationTracking', locationTrackingSchema);
