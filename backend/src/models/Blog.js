const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
      minlength: [50, 'Content must be at least 50 characters']
    },
    destination: {
      type: String,
      required: true
    },
    tags: [String],
    thumbnail: {
      type: String,
      default: null
    },
    images: [String],
    videos: [String],
    safetyRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    safetyReview: {
      type: String,
      required: true
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public'
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    likes: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        likedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    comments: [
      {
        commenterId: mongoose.Schema.Types.ObjectId,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    bookmarks: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        bookmarkedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    viewCount: {
      type: Number,
      default: 0
    },
    travelDates: {
      startDate: Date,
      endDate: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
