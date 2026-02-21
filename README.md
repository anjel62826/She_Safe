# She_Safe 👩‍🚀

A secure, women-only travel platform designed to empower women travelers with safety features, community connections, and real-time emergency support.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-green.svg)](https://www.mongodb.com/)

## 📋 Project Description

**She_Safe** is a comprehensive travel safety platform specifically designed for women travelers. It combines modern web technologies with essential safety features to create a secure ecosystem where women can:
- Share travel plans and find verified travel buddies
- Access 24/7 AI-powered safety assistance
- Use emergency SOS features with real-time location sharing
- Build a supportive community through travel experience sharing
- Verify identity and connect with trusted travelers only

The platform prioritizes **privacy, security, and community** above all else.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18+
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Build Tool:** Create React App

### Backend
- **Runtime:** Node.js v20+
- **Framework:** Express.js
- **Database:** MongoDB (with in-memory fallback)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Real-time:** Socket.io
- **Environment:** dotenv

### Infrastructure
- **Deployment:** GitHub Codespaces (Development)
- **API Format:** REST
- **Database Driver:** Mongoose ODM

### Development Tools
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Task Runner:** npm scripts
- **Code Formatting:** ESLint

---

## ✨ Features

### 1. **Verified Safety (DigiLocker Integration)**
- Government ID verification through DigiLocker
- Verified badge display for trusted travelers
- Scam prevention and fake account detection

### 2. **Buddy Finder**
- Find verified travel companions by destination
- Filter by interests and travel style
- Send buddy requests and manage connections
- View buddy profiles and verification status

### 3. **My Schedule (Travel Plans)**
- Post your travel itineraries with dates and budget
- Share destination and travel type (solo, group, business)
- Find travelers with overlapping dates and destinations
- Manage multiple travel plans

### 4. **Emergency SOS**
- One-tap emergency button with location sharing
- Instant alerts to emergency contacts
- Real-time GPS tracking
- Emergency hotline integration ready

### 5. **Travel Experience Blog**
- Share travel stories and recommendations
- Post safety reviews of destinations
- Like, comment, and bookmark experiences
- Engage with community content

### 6. **AI Chatbot Assistant**
- 24/7 safety tips and guidance
- Instant responses about features
- Scam prevention education
- Travel advice and recommendations

### 7. **Live Chat Messaging**
- Direct messaging with verified buddies
- Real-time notifications
- Message history
- Group conversation support

### 8. **Location Tracking & Safe Routes**
- Real-time GPS tracking with trusted contacts
- Safe route recommendations
- Geofencing alerts
- Incident reporting

---

## 📦 Installation

### Prerequisites
- Node.js v20+ and npm
- Git
- MongoDB (optional - app has in-memory fallback)
- Modern web browser

### Clone Repository
```bash
git clone https://github.com/anjel62826/She_Safe.git
cd She_Safe
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# DATABASE_URL=mongodb://localhost:27017/she_safe
# JWT_SECRET=your_jwt_secret_key
# PORT=5000
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# REACT_APP_API_URL=http://localhost:5000
```

---

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
PORT=3000 npm start
```
Frontend will run on `http://localhost:3000`

### Access the Application
- **Local:** `http://localhost:3000`
- **Codespaces:** `https://<codespace-url>-3000.app.github.dev`

---

## 📸 Screenshots

### 1. Home Page - Hero Section
The landing page features a captivating hero section with calls-to-action for "Get Started" and "Learn More", followed by a grid of key features that users can explore.

**[Add Screenshot: Homepage with hero section and features grid]**

### 2. Dashboard - User Central Hub
The dashboard provides a personalized welcome message, displays key metrics (buddy requests, messages, alerts, active trips), and offers quick action buttons for core features.

**[Add Screenshot: Dashboard with personalized greeting, metrics, and action buttons]**

### 3. Travel Experiences - Community Blog
Users can browse travel stories shared by other women travelers, filter by destination, like/comment on posts, and share their own experiences.

**[Add Screenshot: Travel experience feed showing blog cards with likes and comments]**

### 4. Buddy Finder - Connect with Travelers
This page allows women to search for travel buddies by destination, view verified profiles, and send buddy requests to travelers with overlapping itineraries.

**[Add Screenshot: Buddy finder showing verified traveler cards with profiles]**

---

## 🎥 Demo Video

**[Add Demo Video Link Here]**

Example structure: https://youtu.be/your-demo-video

### Demo Highlights:
- 👤 User signup, email verification, and government ID verification
- 📅 Posting a travel plan with destination and dates
- 👯 Finding and connecting with travel buddies
- 💬 Using the AI chatbot for safety tips
- ✍️ Sharing a travel experience and engaging with community
- 🚨 Emergency SOS feature demonstration
- 📍 Real-time location sharing setup

---

## 🏗 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Frontend)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ React App (Port 3000)                                │  │
│  │ ├─ Pages: Home, Dashboard, Blog, Buddy Finder       │  │
│  │ ├─ Components: Navbar, Modal, ChatBot, etc.         │  │
│  │ └─ Services: apiClient (Axios)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTP/REST API
                  (Axios Interceptor)
                           │
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Backend)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Express.js (Port 5000)                               │  │
│  │ ├─ Routes: /auth, /blogs, /buddies, /travel-plans   │  │
│  │ ├─ Middleware: JWT Auth, Error Handling             │  │
│  │ └─ Controllers: Auth, Blog, Buddy, Travel Plan      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│         ┌────────────────┼────────────────┐                │
│         │                │                │                │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌────▼──────────┐    │
│  │ MongoDB     │  │ DBAdapter   │  │ Mock Database │    │
│  │ (Primary)   │  │ (Fallback   │  │ (Offline Dev) │    │
│  │             │  │  Logic)     │  │               │    │
│  └─────────────┘  └─────────────┘  └───────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                          │
│  ├─ DigiLocker (Government ID Verification)               │
│  ├─ JWT (Authentication)                                   │
│  ├─ Socket.io (Real-time Chat)                            │
│  └─ Google Maps API (Location/Routes) - Ready to integrate │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
```
User Action → React Component → API Call (axios)
    → Backend Route → Middleware (JWT) → Controller
    → Database/Mock DB → Response → UI Update
```

---

## 📚 API Documentation

### Base URL
- **Local Development:** `http://localhost:5000/api`
- **Production:** Update based on deployment

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### **Authentication**
```
POST /auth/signup
POST /auth/login
GET  /auth/profile (Protected)
```

#### **Travel Plans**
```
POST   /travel-plans (Protected) - Create plan
GET    /travel-plans/my-plans (Protected) - Get user's plans
GET    /travel-plans/all - Get all plans (for buddy matching)
GET    /travel-plans/:planId - Get specific plan
PUT    /travel-plans/:planId (Protected) - Update plan
DELETE /travel-plans/:planId (Protected) - Delete plan
```

#### **Blogs (Experiences)**
```
POST   /blogs (Protected) - Post experience
GET    /blogs - Get all experiences
GET    /blogs/:blogId - Get single experience
POST   /blogs/:blogId/like (Protected) - Like experience
POST   /blogs/:blogId/comment (Protected) - Comment
DELETE /blogs/:blogId (Protected) - Delete post
```

#### **Buddy Finder**
```
GET    /buddy/find?destination=<city> - Find buddies
POST   /buddy/request (Protected) - Send buddy request
GET    /buddy/requests (Protected) - Get requests
PUT    /buddy/requests/:requestId (Protected) - Accept/Reject
```

#### **Health Check**
```
GET /health - Check API status
```

### Request/Response Examples

**POST /auth/signup**
```json
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123!",
  "dateOfBirth": "1990-01-01",
  "governmentId": "123456789"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "_id": "1000",
    "firstName": "John",
    "email": "john@example.com",
    "isVerified": false
  }
}
```

**POST /travel-plans**
```json
Request:
{
  "destination": "Paris",
  "startDate": "2024-03-01",
  "endDate": "2024-03-10",
  "budget": "mid-range",
  "travelType": "solo",
  "description": "Exploring Paris"
}

Response:
{
  "success": true,
  "message": "Travel plan created successfully",
  "travelPlan": {
    "_id": "plan_1234567890",
    "destination": "Paris",
    "startDate": "2024-03-01T00:00:00.000Z",
    "endDate": "2024-03-10T00:00:00.000Z",
    "budget": "mid-range",
    "createdAt": "2026-02-21T03:28:15.970Z"
  }
}
```

**GET /blogs**
```json
Response:
{
  "success": true,
  "count": 2,
  "blogs": [
    {
      "_id": "3000",
      "title": "Paris Trip",
      "destination": "Paris",
      "likes": [],
      "author": {
        "_id": "1003",
        "firstName": "Alice"
      }
    }
  ]
}
```

### Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error details"
}
```

---

## 👥 Team Members

| Name | Role | GitHub |
|------|------|--------|
| Anmol | Full Stack Developer | [@anjel62826](https://github.com/anjel62826) |
| Community Contributors | Welcome! | [Contribute](#contributing) |

### Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Usage Permissions
✅ **Allowed:**
- Commercial use
- Private use
- Modification
- Distribution

❌ **Not Allowed:**
- Liability
- Warranty

---

## 🔒 Privacy & Security

- **End-to-end encryption** for sensitive data
- **Government ID verification** via DigiLocker
- **JWT authentication** for API security
- **Password hashing** with bcryptjs
- **Women-only platform** for safety
- **Data privacy** compliance ready

---

## 📞 Support & Contact

- **Email:** support@shesafe.com
- **GitHub Issues:** [Report bugs](https://github.com/anjel62826/She_Safe/issues)
- **Discussion:** [GitHub Discussions](https://github.com/anjel62826/She_Safe/discussions)

---

## 🚦 Project Status

- ✅ MVP (Minimum Viable Product) - Complete
- ✅ Core Features - Implemented
- 🔄 Testing - In Progress
- 🔄 Deployment - Preparing
- 📋 Phase 2 - Planned

### Roadmap
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with travel booking APIs
- [ ] Multi-language support
- [ ] Offline mode
- [ ] AI-powered safety recommendations

---

## ⭐ Give us a Star!

If you find this project helpful, please consider giving it a star on GitHub! It helps us reach more people and build a safer travel community for women.

---

## 📝 Changelog

### v1.0.0 (Current)
- ✨ Initial release
- ✅ Authentication (Signup/Login)
- ✅ Travel Plans posting and discovery
- ✅ Buddy Finder feature
- ✅ Travel Experience blog
- ✅ AI Chatbot assistant
- ✅ Emergency SOS feature (UI ready)
- ✅ Mock database for offline development

---

**Made with ❤️ for women travelers worldwide**

*Let's make solo travel safer, together.*