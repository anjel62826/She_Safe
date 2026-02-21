# Deployment Instructions

## Quick Start (Development)

### 1. Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
# App opens on http://localhost:3000
```

---

## Production Deployment

### Option 1: Heroku (Recommended for Beginners)

#### Backend
```bash
# Prerequisites: Git, Heroku CLI installed
heroku login
cd backend
heroku create she-safe-backend
heroku config:set JWT_SECRET=<your-secret>
heroku config:set MONGODB_URI=<mongodb-url>
git push heroku main
```

#### Frontend
```bash
cd frontend
npm run build
# Deploy to Vercel
vercel --prod
```

### Option 2: AWS + Docker

#### Build Docker Image
```bash
docker build -t she-safe-backend ./backend
docker tag she-safe-backend:latest <aws-account>.dkr.ecr.us-east-1.amazonaws.com/she-safe:latest
```

#### Push to ECR
```bash
aws ecr push <aws-account>.dkr.ecr.us-east-1.amazonaws.com/she-safe:latest
```

#### Deploy with CloudFormation or ECS

### Option 3: DigitalOcean App Platform

1. Fork repository
2. Connect GitHub account
3. Deploy from Web UI
4. Configure environment variables
5. Deploy!

---

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
JWT_SECRET=very_long_random_secret_key
FRONTEND_URL=https://your-domain.com
GOOGLE_MAPS_API_KEY=your_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### Frontend (.env)
```
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_SOCKET_URL=https://api.your-domain.com
```

---

## Database Migration

### Step 1: Create MongoDB Atlas Cluster
- Go to https://www.mongodb.com/cloud/atlas
- Create cluster
- Whitelist your IP
- Get connection string

### Step 2: Create Indexes
```javascript
db.users.createIndex({ email: 1 })
db.users.createIndex({ digiLockerVerificationId: 1 }, { sparse: true })
db.emergencyalerts.createIndex({ 'location.coordinates': '2dsphere' })
db.locationtrackings.createIndex({ 'location.coordinates': '2dsphere' })
db.safezones.createIndex({ 'location.coordinates': '2dsphere' })
```

---

## Checklist

- [ ] Environment variables configured
- [ ] Database running and indexed
- [ ] Backend server deployed
- [ ] Frontend built and deployed
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Email service configured
- [ ] API keys validated
- [ ] Emergency system tested
- [ ] User can signup/login
- [ ] Payment processing (if applicable)

---

For detailed setup: See `SETUP_GUIDE.md`
