const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number']
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    profilePicture: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: 500
    },

    // Authentication
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    digiLockerVerificationId: {
      type: String,
      unique: true,
      sparse: true
    },
    verificationDocument: {
      type: String,
      default: null
    },
    verificationDate: {
      type: Date,
      default: null
    },
    governmentId: {
      type: String,
      required: true
    },

    // Travel Preferences
    travelHistory: [
      {
        destination: String,
        startDate: Date,
        endDate: Date,
        travelType: {
          type: String,
          enum: ['solo', 'group', 'business', 'leisure'],
          default: 'solo'
        },
        safetyRating: {
          type: Number,
          min: 1,
          max: 5
        },
        review: String
      }
    ],
    interests: [String],
    budget: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury']
    },
    languages: [String],

    // Emergency Contacts
    emergencyContacts: [
      {
        name: String,
        phone: String,
        email: String,
        relation: String
      }
    ],

    // Social Links
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String
    },

    // Preferences
    preferences: {
      darkMode: {
        type: Boolean,
        default: false
      },
      emailNotifications: {
        type: Boolean,
        default: true
      },
      smsNotifications: {
        type: Boolean,
        default: true
      },
      showProfile: {
        type: Boolean,
        default: false
      }
    },

    // Role
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user'
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    isBanned: {
      type: Boolean,
      default: false
    },

    timestamps: {
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = mongoose.model('User', userSchema);
