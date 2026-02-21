# Database Schema Documentation

## Collections Overview

## 1. User Collection

**Purpose**: Store user account and profile information

```javascript
{
  _id: ObjectId,
  
  // Basic Information
  firstName: String (required, min 2 chars),
  lastName: String (required),
  email: String (required, unique, validated),
  phone: String (required, validated),
  dateOfBirth: Date (required),
  profilePicture: String (URL or base64),
  bio: String (max 500 chars),
  
  // Authentication
  password: String (hashed with bcrypt, never exposed),
  
  // Verification
  isVerified: Boolean (default: false),
  verificationStatus: String (enum: 'pending', 'verified', 'rejected'),
  digiLockerVerificationId: String (unique, sparse, indexed),
  verificationDocument: String (URL),
  verificationDate: Date,
  governmentId: String (required, unique),
  
  // Travel Information
  travelHistory: [
    {
      destination: String,
      startDate: Date,
      endDate: Date,
      travelType: String (enum: 'solo', 'group', 'business', 'leisure'),
      safetyRating: Number (1-5),
      review: String
    }
  ],
  interests: [String],
  budget: String (enum: 'budget', 'mid-range', 'luxury'),
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
    darkMode: Boolean (default: false),
    emailNotifications: Boolean (default: true),
    smsNotifications: Boolean (default: true),
    showProfile: Boolean (default: false)
  },
  
  // Role & Status
  role: String (enum: 'user', 'admin', 'moderator', default: 'user'),
  isActive: Boolean (default: true),
  isBanned: Boolean (default: false),
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
db.users.createIndex({ email: 1 })
db.users.createIndex({ digiLockerVerificationId: 1, sparse: true })
db.users.createIndex({ createdAt: -1 })
```

---

## 2. BuddyRequest Collection

**Purpose**: Track buddy connection requests

```javascript
{
  _id: ObjectId,
  
  from: ObjectId (ref: User),
  to: ObjectId (ref: User),
  message: String,
  
  // Trip Details
  destination: String (required),
  startDate: Date (required),
  endDate: Date (required),
  travelType: String (enum: 'solo', 'group', 'business', 'leisure'),
  
  // Status
  status: String (enum: 'pending', 'accepted', 'rejected', 'cancelled'),
  respondedAt: Date,
  expiresAt: Date (TTL index, 24 hours),
  
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
db.buddyrequests.createIndex({ to: 1, status: 1 })
db.buddyrequests.createIndex({ from: 1, to: 1, status: 1 })
db.buddyrequests.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

---

## 3. BuddyConnection Collection

**Purpose**: Store successful buddy pairings

```javascript
{
  _id: ObjectId,
  
  buddy1: ObjectId (ref: User),
  buddy2: ObjectId (ref: User),
  
  // Rating & Review
  rating: Number (min: 1, max: 5, default: 0),
  review: String (max 500),
  
  // Shared Experience
  sharedTrips: [
    {
      destination: String,
      startDate: Date,
      endDate: Date,
      photos: [String]
    }
  ],
  
  // Status
  mutualContacts: Boolean (default: false),
  isFavorite: Boolean (default: false),
  blockedBy: ObjectId (ref: User, nullable),
  
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
db.buddyconnections.createIndex({ buddy1: 1, buddy2: 1 })
db.buddyconnections.createIndex({ buddy1: 1 })
db.buddyconnections.createIndex({ buddy2: 1 })
```

---

## 4. Blog Collection

**Purpose**: Store travel experience blogs

```javascript
{
  _id: ObjectId,
  
  author: ObjectId (ref: User, required),
  title: String (required, 5-200 chars),
  content: String (required, min 50 chars),
  destination: String (required),
  
  // Media
  thumbnail: String,
  images: [String],
  videos: [String],
  
  // Tags & Metadata
  tags: [String],
  safetyRating: Number (1-5, required),
  safetyReview: String (required),
  
  // Travel Dates
  travelDates: {
    startDate: Date,
    endDate: Date
  },
  
  // Visibility & Status
  visibility: String (enum: 'public', 'private', 'friends', default: 'public'),
  isApproved: Boolean (default: true),
  
  // Engagement
  likes: [
    {
      userId: ObjectId,
      likedAt: Date
    }
  ],
  comments: [
    {
      commenterId: ObjectId,
      text: String,
      createdAt: Date
    }
  ],
  bookmarks: [
    {
      userId: ObjectId,
      bookmarkedAt: Date
    }
  ],
  
  viewCount: Number (default: 0),
  
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
db.blogs.createIndex({ destination: 1 })
db.blogs.createIndex({ tags: 1 })
db.blogs.createIndex({ author: 1 })
db.blogs.createIndex({ isApproved: 1, visibility: 1 })
db.blogs.createIndex({ safetyRating: -1 })
db.blogs.createIndex({ createdAt: -1 })
```

---

## 5. EmergencyAlert Collection

**Purpose**: Track emergency SOS alerts

```javascript
{
  _id: ObjectId,
  
  userId: ObjectId (ref: User, required),
  
  // Location
  location: {
    type: String (enum: 'Point'),
    coordinates: [Number] // [longitude, latitude]
  },
  
  // Alert Details
  status: String (enum: 'triggered', 'acknowledged', 'resolved', 'false_alarm'),
  type: String (enum: 'sos_button', 'unsafe_message', 'location_anomaly'),
  alertMessage: String,
  severity: String (enum: 'low', 'medium', 'high', 'critical', default: 'high'),
  
  // Notifications
  notifiedContacts: [
    {
      contactId: ObjectId,
      notificationMethod: String (enum: 'sms', 'email', 'app_notification'),
      sentAt: Date,
      acknowledged: Boolean
    }
  ],
  
  // Nearby Resources
  nearbyPoliceStations: [
    {
      name: String,
      distance: Number,
      location: { latitude: Number, longitude: Number },
      phone: String
    }
  ],
  nearbyHospitals: [
    {
      name: String,
      distance: Number,
      location: { latitude: Number, longitude: Number }
    }
  ],
  
  // Resolution
  responderNotes: String,
  resolvedAt: Date,
  resolvedBy: ObjectId (ref: User),
  
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes (Geospatial)
db.emergencyalerts.createIndex({ 'location.coordinates': '2dsphere' })
db.emergencyalerts.createIndex({ userId: 1, createdAt: -1 })
db.emergencyalerts.createIndex({ status: 1 })
```

---

## 6. LocationTracking Collection

**Purpose**: Store live location updates

```javascript
{
  _id: ObjectId,
  
  userId: ObjectId (ref: User, required),
  tripId: ObjectId (ref: TravelPlan, nullable),
  
  // Location Data
  location: {
    type: String (enum: 'Point'),
    coordinates: [Number] // [longitude, latitude]
  },
  address: String,
  accuracy: Number (in meters),
  speed: Number (in km/h),
  heading: Number (in degrees),
  
  // Sharing
  sharedWith: [
    {
      userId: ObjectId,
      sharedAt: Date
    }
  ],
  
  // Status
  isActive: Boolean (default: true),
  
  createdAt: Date (auto, indexed),
  updatedAt: Date (auto)
}

// Indexes (Geospatial + TTL)
db.locationtrackings.createIndex({ 'location.coordinates': '2dsphere' })
db.locationtrackings.createIndex({ userId: 1, createdAt: -1 })
db.locationtrackings.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }) // 30 days TTL
```

---

## 7. TravelPlan Collection

**Purpose**: Store travel itinararies and plans

```javascript
{
  _id: ObjectId,
  
  userId: ObjectId (ref: User, required),
  
  // Trip Details
  destination: String (required),
  startDate: Date (required),
  endDate: Date (required),
  description: String,
  
  // Budget & Type
  budget: String (enum: 'budget', 'mid-range', 'luxury'),
  travelType: String (enum: 'solo', 'group', 'business', 'leisure', default: 'solo'),
  
  // Buddies
  buddies: [
    {
      buddyId: ObjectId,
      joinedAt: Date
    }
  ],
  
  // Itinerary
  itinerary: [
    {
      day: Number,
      activities: [String],
      accommodation: String,
      notes: String
    }
  ],
  
  // Safety
  safetyNotes: [String],
  emergencyContactsToNotify: [
    {
      contactId: ObjectId,
      notificationMethod: String (enum: 'sms', 'email')
    }
  ],
  
  // Status & Visibility
  status: String (enum: 'planned', 'ongoing', 'completed', 'cancelled', default: 'planned'),
  visibility: String (enum: 'public', 'private', 'friends', default: 'friends'),
  
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
db.travelplans.createIndex({ userId: 1, startDate: 1 })
db.travelplans.createIndex({ destination: 1 })
db.travelplans.createIndex({ status: 1 })
```

---

## 8. SafeZone Collection

**Purpose**: Store police stations, hospitals, safe houses

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  name: String (required),
  type: String (enum: 'police_station', 'hospital', 'safe_house', 'shelter'),
  address: String (required),
  
  // Location (Geospatial)
  location: {
    type: String (enum: 'Point'),
    coordinates: [Number] // [longitude, latitude]
  },
  
  // Contact
  phone: String,
  email: String,
  website: String,
  
  // Hours
  operatingHours: {
    open: String,
    close: String,
    alwaysOpen: Boolean (default: false)
  },
  
  // Information
  services: [String],
  features: [String],
  rating: Number (1-5, default: 0),
  verified: Boolean (default: false),
  
  // Reviews
  reviews: [
    {
      userId: ObjectId,
      rating: Number,
      comment: String,
      createdAt: Date
    }
  ],
  
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes (Geospatial)
db.safezones.createIndex({ 'location.coordinates': '2dsphere' })
db.safezones.createIndex({ type: 1 })
db.safezones.createIndex({ verified: 1 })
```

---

## 9. ChatMessage Collection

**Purpose**: Store private messages between users

```javascript
{
  _id: ObjectId,
  
  conversationId: String (required, indexed),
  senderId: ObjectId (ref: User, required),
  receiverId: ObjectId (ref: User, required),
  
  // Message Content
  message: String (required),
  attachments: [
    {
      type: String,
      url: String
    }
  ],
  
  // Safety
  unsafeKeywordsDetected: [String],
  isEmergency: Boolean (default: false),
  
  // Status
  isRead: Boolean (default: false),
  readAt: Date,
  
  createdAt: Date (auto, indexed),
  updatedAt: Date (auto)
}

// Indexes
db.chatmessages.createIndex({ conversationId: 1, createdAt: -1 })
db.chatmessages.createIndex({ senderId: 1, createdAt: -1 })
db.chatmessages.createIndex({ receiverId: 1, isRead: 1 })
```

---

## Query Examples

### Find All Verified Users
```javascript
db.users.find({ isVerified: true, isBanned: false })
  .sort({ createdAt: -1 })
  .limit(10)
```

### Find Buddy Requests for a User
```javascript
db.buddyrequests.find({ to: userId, status: 'pending' })
  .populate('from', 'firstName lastName profilePicture')
```

### Find Nearby Safe Zones
```javascript
db.safezones.find({
  'location.coordinates': {
    $near: {
      $geometry: { type: "Point", coordinates: [longitude, latitude] },
      $maxDistance: 5000 // 5km
    }
  }
})
.limit(5)
```

### Get Popular Travel Destinations
```javascript
db.blogs.aggregate([
  { $match: { isApproved: true } },
  { $group: { _id: '$destination', count: { $sum: 1 }, avgRating: { $avg: '$safetyRating' } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

### Get User's Travel History with Buddies
```javascript
db.travelplans.find({ userId: userId })
  .populate('buddies.buddyId', 'firstName lastName profilePicture')
  .sort({ startDate: -1 })
```

---

## Data Relationships

```
User
├── BuddyRequest (from/to)
├── BuddyConnection (buddy1/buddy2)
├── Blog (author)
├── EmergencyAlert (userId)
├── LocationTracking (userId)
├── TravelPlan (userId)
├── ChatMessage (senderId/receiverId)
└── SafeZone (reviews)
```

---

## Backup & Recovery Strategy

### Daily Backups
```bash
# Backup entire database
mongodump --uri="mongodb://user:pass@host:27017/she_safe"

# Restore from backup
mongorestore --uri="mongodb://user:pass@host:27017/" dump/
```

### Data Retention
- User data: Indefinite (with GDPR right to deletion)
- Location tracking: 30 days (auto-delete via TTL)
- Emergency alerts: 5 years (legal/compliance)
- Chat messages: 1 year (unless user requests deletion)
- Blog posts: Indefinite (unless deleted by author)

---

## Performance Optimization

### Caching Strategy
- User profiles: Cache for 1 hour
- Buddy lists: Cache for 15 minutes
- Safe zones: Cache for 24 hours
- Trending blogs: Cache for 2 hours

### Sharding Strategy (for scale)
```
Shard Key: userId
- Distributes data evenly
- Good for user-centric queries
- Enables horizontal scaling
```

---

## Data Privacy & Security

- All passwords hashed with bcrypt (salt rounds: 10)
- Sensitive data encrypted at rest
- HTTPS only transmission
- Regular security audits
- GDPR compliant deletion process

---

For schema modifications: Contact database team
For migration scripts: See migrations/ folder
