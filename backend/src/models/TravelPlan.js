const mongoose = require('mongoose');

const travelPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination']
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    description: String,
    budget: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      required: true
    },
    travelType: {
      type: String,
      enum: ['solo', 'group', 'business', 'leisure'],
      default: 'solo'
    },
    buddies: [
      {
        buddyId: mongoose.Schema.Types.ObjectId,
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    itinerary: [
      {
        day: Number,
        activities: [String],
        accommodation: String,
        notes: String
      }
    ],
    safetyNotes: [String],
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed', 'cancelled'],
      default: 'planned'
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'friends'
    },
    emergencyContactsToNotify: [
      {
        contactId: mongoose.Schema.Types.ObjectId,
        notificationMethod: {
          type: String,
          enum: ['sms', 'email']
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TravelPlan', travelPlanSchema);
