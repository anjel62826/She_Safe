const mongoose = require('mongoose');

const safeZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['police_station', 'hospital', 'safe_house', 'shelter'],
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
    address: {
      type: String,
      required: true
    },
    phone: String,
    email: String,
    operatingHours: {
      open: String,
      close: String,
      alwaysOpen: {
        type: Boolean,
        default: false
      }
    },
    website: String,
    services: [String],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    features: [String],
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create geospatial index
safeZoneSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('SafeZone', safeZoneSchema);
