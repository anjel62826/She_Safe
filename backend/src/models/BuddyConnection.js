const mongoose = require('mongoose');

const buddyConnectionSchema = new mongoose.Schema(
  {
    buddy1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buddy2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
    review: {
      type: String,
      maxlength: 500
    },
    sharedTrips: [
      {
        destination: String,
        startDate: Date,
        endDate: Date,
        photos: [String]
      }
    ],
    mutualContacts: {
      type: Boolean,
      default: false
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BuddyConnection', buddyConnectionSchema);
