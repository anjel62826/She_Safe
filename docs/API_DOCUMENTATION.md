# API DOCUMENTATION

## Base URL
```
Backend: http://localhost:5000/api
Frontend: http://localhost:3000
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer {token}
```

## Response Format
```json
{
  "success": true/false,
  "message": "Description",
  "data": {},
  "error": ""
}
```

---

## Authentication Endpoints

### POST /auth/signup
Create new user account
```json
{
  "firstName": "Priya",
  "lastName": "Kumar",
  "email": "priya@example.com",
  "phone": "+91-9876543210",
  "password": "securepass123",
  "dateOfBirth": "1995-05-15",
  "governmentId": "AADHAAR123456"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User created successfully. Please verify with DigiLocker",
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "ObjectId",
    "firstName": "Priya",
    "email": "priya@example.com",
    "isVerified": false,
    "verificationStatus": "pending"
  }
}
```

### POST /auth/login
User login
```json
{
  "email": "priya@example.com",
  "password": "securepass123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOi...",
  "user": { ...user data }
}
```

### POST /auth/verify-digilocker
Verify identity with DigiLocker
```json
{
  "documentUrl": "https://...",
  "documentType": "aadhaar"
}
```

### GET /auth/profile
Get user profile (Protected)

### PUT /auth/profile
Update user profile (Protected)
```json
{
  "bio": "Love exploring new places safely",
  "interests": ["hiking", "food", "photography"],
  "preferences": {
    "darkMode": true,
    "emailNotifications": true
  }
}
```

---

## Buddy System Endpoints

### GET /buddy/find
Find travel buddies (Protected)
**Query Parameters:**
- destination: "Paris"
- budget: "mid-range"
- interests: "hiking,food"
- startDate: "2024-06-15"
- endDate: "2024-06-20"

**Response:**
```json
{
  "success": true,
  "count": 5,
  "buddies": [
    {
      "_id": "ObjectId",
      "firstName": "Priya",
      "lastName": "Kumar",
      "profilePicture": "url",
      "isVerified": true,
      "interests": ["hiking", "food"],
      "budget": "mid-range",
      "bio": "Adventure seeker"
    }
  ]
}
```

### POST /buddy/request
Send buddy request (Protected)
```json
{
  "toUserId": "ObjectId",
  "message": "Hi, would you like to explore Paris together?",
  "destination": "Paris",
  "startDate": "2024-06-15",
  "endDate": "2024-06-20",
  "travelType": "solo"
}
```

### GET /buddy/requests
Get received buddy requests (Protected)

### PUT /buddy/requests/:requestId
Response to buddy request (Protected)
```json
{
  "status": "accepted"
}
```

### GET /buddy/connections
Get connected buddies (Protected)

### POST /buddy/rate
Rate a buddy (Protected)
```json
{
  "buddyId": "ObjectId",
  "rating": 5,
  "review": "Great travel companion, very safe and punctual!"
}
```

---

## Blog Endpoints

### POST /blog
Create blog post (Protected)
```json
{
  "title": "My Amazing Trip to Paris",
  "content": "Detailed content about the trip...",
  "destination": "Paris",
  "tags": ["paris", "france", "solo-travel"],
  "safetyRating": 5,
  "safetyReview": "Very safe and friendly city",
  "startDate": "2024-06-15",
  "endDate": "2024-06-20",
  "visibility": "public"
}
```

### GET /blog
Get all blogs (Public)
**Query Parameters:**
- destination: "Paris"
- tag: "paris"
- page: 1
- limit: 10

### GET /blog/:blogId
Get specific blog (Public)

### POST /blog/:blogId/like
Like a blog (Protected)

### POST /blog/:blogId/comment
Comment on blog (Protected)
```json
{
  "text": "This is such an inspiring post!"
}
```

### POST /blog/:blogId/bookmark
Bookmark a blog (Protected)

### GET /blog/destinations/popular
Get popular destinations (Public)

---

## Emergency Endpoints

### POST /emergency/trigger
Trigger emergency SOS (Protected)
```json
{
  "latitude": 48.8566,
  "longitude": 2.3522,
  "message": "I feel unsafe, need help",
  "type": "sos_button"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Emergency alert triggered. Help is on the way!",
  "alert": {
    "alertId": "ObjectId",
    "status": "triggered",
    "nearbyPoliceStations": [
      {
        "name": "Police Station, 8th Arr.",
        "distance": 2.3,
        "phone": "+33-1-XXXX-XXXX"
      }
    ],
    "nearbyHospitals": [
      {
        "name": "Hospital Name",
        "distance": 1.2
      }
    ]
  }
}
```

### GET /emergency/nearby
Get nearby safe locations (Public)
**Query Parameters:**
- latitude: 48.8566
- longitude: 2.3522
- radius: 5 (km)
- type: "police_station" (optional)

### GET /emergency/alerts
Get your emergency alerts (Protected)

### PUT /emergency/alerts/:alertId/resolve
Resolve emergency (Protected)
```json
{
  "notes": "Situation resolved, woman is safe"
}
```

### GET /emergency/numbers
Get emergency numbers (Public)
**Response:**
```json
{
  "success": true,
  "emergencyNumbers": {
    "police": "100",
    "ambulance": "102",
    "fireService": "101",
    "women_helpline": "1091",
    "childAbuse": "1098",
    "disaster_management": "108"
  }
}
```

---

## Location Endpoints

### POST /location/tracking/start
Start live tracking (Protected)
```json
{
  "latitude": 48.8566,
  "longitude": 2.3522,
  "tripId": "ObjectId"
}
```

### POST /location/tracking/update
Update location (Protected)
```json
{
  "latitude": 48.8566,
  "longitude": 2.3522,
  "accuracy": 10,
  "speed": 25,
  "heading": 90
}
```

### GET /location/tracking/:userId
Get live location (Protected)

### POST /location/tracking/share
Share location with contacts (Protected)
```json
{
  "shareWith": ["userId1", "userId2"],
  "duration": "24 hours"
}
```

### POST /location/plans
Create travel plan (Protected)
```json
{
  "destination": "Paris",
  "startDate": "2024-06-15",
  "endDate": "2024-06-20",
  "budget": "mid-range",
  "travelType": "solo",
  "description": "Summer trip to Paris",
  "itinerary": [
    {
      "day": 1,
      "activities": ["Arrive at CDG", "Check-in at hotel"],
      "accommodation": "Hotel Name",
      "notes": "Pick up from airport"
    }
  ],
  "safetyNotes": ["Avoid traveling late night", "Keep valuables safe"]
}
```

### GET /location/plans
Get your travel plans (Protected)

### PUT /location/plans/:planId
Update travel plan (Protected)

---

## Chat Endpoints

### POST /chat/send
Send message (Protected)
```json
{
  "receiverId": "ObjectId",
  "message": "Hi! Are you still interested in the Paris trip?",
  "conversationId": "conv_userId1_userId2"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Message sent",
  "chatMessage": {
    "_id": "ObjectId",
    "senderId": "ObjectId",
    "receiverId": "ObjectId",
    "message": "Hi! Are you still interested in the Paris trip?",
    "unsafeKeywordsDetected": [],
    "isEmergency": false,
    "createdAt": "2024-02-20T10:30:00Z"
  },
  "warnings": null
}
```

### GET /chat/messages
Get conversation messages (Protected)
**Query Parameters:**
- conversationId: "conv_id"
- page: 1
- limit: 20

### POST /chat/bot
Chat with AI bot (Protected)
```json
{
  "message": "What are safety tips for Paris?"
}
```
**Response:**
```json
{
  "success": true,
  "botResponse": {
    "message": "Here are some safety tips for Paris...",
    "type": "info",
    "suggestedActions": ["view_more_tips"],
    "unsafeKeywordDetected": []
  }
}
```

### GET /chat/tips
Get travel safety tips (Public)
**Query Parameters:**
- destination: "Paris"
- category: "street_safety"

**Response:**
```json
{
  "success": true,
  "destination": "Paris",
  "categories": ["general", "transportation", "accommodation", "street_safety"],
  "tips": {
    "general": [...],
    "transportation": [...],
    "accommodation": [...],
    "street_safety": [...]
  }
}
```

### PUT /chat/messages/:messageId/read
Mark message as read (Protected)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please fill in all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## Rate Limiting
- API calls limited to 100 requests per minute per user
- Emergency endpoints have no rate limit

## WebSocket Events (Real-time)
```
user:connected - User comes online
message:send - Send message
message:receive - Receive message
location:update - Location tracking
emergency:triggered - Emergency alert
```

## Sample API Usage

### Example: Complete User Journey

**1. Signup**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Priya",
    "lastName": "Kumar",
    "email": "priya@example.com",
    "phone": "+91-9876543210",
    "password": "securepass123",
    "dateOfBirth": "1995-05-15",
    "governmentId": "AADHAAR123456"
  }'
```

**2. Verify DigiLocker**
```bash
curl -X POST http://localhost:5000/api/auth/verify-digilocker \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "documentUrl": "https://...",
    "documentType": "aadhaar"
  }'
```

**3. Find Buddies**
```bash
curl "http://localhost:5000/api/buddy/find?destination=Paris&budget=mid-range" \
  -H "Authorization: Bearer {token}"
```

**4. Send Buddy Request**
```bash
curl -X POST http://localhost:5000/api/buddy/request \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "toUserId": "ObjectId",
    "destination": "Paris",
    "startDate": "2024-06-15",
    "endDate": "2024-06-20"
  }'
```

---

For more information, visit: https://shesafe.com/docs
