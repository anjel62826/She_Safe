# Setup & Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js v14+ and npm
- MongoDB (local or MongoDB Atlas)
- Git
- VS Code or any IDE

### Step 1: Clone Repository
```bash
cd /workspaces/She_Safe
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Create Environment File
```bash
cp .env.example .env
```

#### 2.3 Configure Environment Variables
Edit `.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/she_safe
MONGODB_USER=admin
MONGODB_PASSWORD=password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### 2.4 Start MongoDB
```bash
# Mac with Homebrew
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or MongoDB Atlas (Cloud)
# Update MONGODB_URI in .env
```

#### 2.5 Start Backend Server
```bash
npm run dev
```

Expected output:
```
🚀 She_Safe server is running on port 5000
Environment: development
Frontend URL: http://localhost:3000
```

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Create Environment File
```bash
cp .env.example .env
```

#### 3.3 Configure Environment Variables
Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

#### 3.4 Start React Development Server
```bash
npm start
```

This will open `http://localhost:3000` in your browser.

---

## Folder Structure After Setup

```
She_Safe/
├── backend/
│   ├── node_modules/
│   ├── src/
│   ├── .env (created)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── node_modules/
│   ├── src/
│   ├── .env (created)
│   ├── .env.example
│   └── package.json
└── docs/
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    ├── EMERGENCY_WORKFLOW.md
    └── SETUP_GUIDE.md
```

---

## Testing the Application

### Test Signup & Login
1. Navigate to `http://localhost:3000/signup`
2. Fill in the form:
   - First Name: Priya
   - Last Name: Kumar
   - Email: priya@example.com
   - Phone: +91-9876543210
   - DOB: 1995-05-15
   - Government ID: AADHAAR123456
   - Password: TestPass123
3. Click Create Account
4. You'll be redirected to login
5. Login with your credentials

### Test Buddy Finder
1. After login, go to `/buddies`
2. Apply filters (destination, budget)
3. Send buddy request to someone
4. Go to dashboard to see requests

### Test Emergency SOS
1. Go to `/emergency`
2. Click large red SOS button
3. Observe:
   - Screen flashes red
   - Siren plays (check browser audio)
   - Nearby police stations display
   - Emergency numbers show

### Test Chat
1. Send a message with unsafe keywords like "help", "danger"
2. Observe keyword detection warning
3. Get chatbot suggestions

---

## Production Deployment

### Option 1: Deploy on Heroku

#### Backend Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create she-safe-backend

# Set environment variables
heroku config:set JWT_SECRET=your_real_secret
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/she_safe
heroku config:set FRONTEND_URL=https://she-safe-frontend.vercel.app

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Frontend Deployment (on Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set environment variables during setup
REACT_APP_API_URL=https://she-safe-backend.herokuapp.com/api
REACT_APP_SOCKET_URL=https://she-safe-backend.herokuapp.com
```

### Option 2: Deploy on AWS

#### EC2 Instance Setup
```bash
# Launch Ubuntu 20.04 EC2 instance
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb

# Install Nginx
sudo apt-get install -y nginx

# Clone repository
git clone <repo-url>
cd She_Safe/backend
npm install

# Start with PM2
npm install -g pm2
pm2 start src/server.js
pm2 startup
pm2 save
```

#### Configure Nginx
```nginx
# /etc/nginx/sites-available/shesafe
upstream backend {
  server localhost:5000;
}

server {
  listen 80;
  server_name shesafe.com www.shesafe.com;

  location / {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }
}
```

### Option 3: Docker Deployment

#### Create Dockerfile (Backend)
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]
```

#### Build and Run
```bash
# Build image
docker build -t she-safe-backend .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/she_safe \
  -e JWT_SECRET=your_secret \
  --link mongo:mongo \
  she-safe-backend
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/she_safe
      JWT_SECRET: your_secret
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo_data:
```

Run with:
```bash
docker-compose up -d
```

---

## Database Setup for Production

### MongoDB Atlas (Cloud MongoDB)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/she_safe?retryWrites=true&w=majority
   ```

### Create Indexes
```bash
# Connect to MongoDB
mongosh

# Run these commands:
db.users.createIndex({ email: 1 })
db.users.createIndex({ digiLockerVerificationId: 1 }, { sparse: true })
db.emergencyalerts.createIndex({ 'location.coordinates': '2dsphere' })
db.locationtrackings.createIndex({ 'location.coordinates': '2dsphere' })
db.safezones.createIndex({ 'location.coordinates': '2dsphere' })
```

---

## Email Configuration (Optional)

### Gmail Setup
1. Enable 2-factor authentication on Gmail
2. Generate app password
3. Update `.env`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

### SendGrid Setup
```bash
npm install @sendgrid/mail
```

Update code in `notificationService.js`:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  await sgMail.send({ from: 'support@shesafe.com', to, subject, html });
};
```

---

## Google Maps API Setup

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Maps JavaScript API
4. Create API key
5. Update `.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key
   ```

---

## SSL Certificate Setup

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d shesafe.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Analytics

### Application Performance Monitoring
```bash
# Install AWS CloudWatch
npm install aws-sdk

# Configure in server.js
const CloudWatch = require('aws-sdk').CloudWatch;
```

### Error Tracking (Sentry)
```bash
npm install @sentry/node

# In server.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your_sentry_dsn" });
```

---

## Security Checklist

### Before Production
- [ ] Change all default credentials
- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT secret
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup error logging
- [ ] Enable database backups
- [ ] Configure firewall
- [ ] Enable DDoS protection
- [ ] Regular security audits

### Daily Tasks
- [ ] Monitor error logs
- [ ] Check application performance
- [ ] Verify emergency alerts working
- [ ] Monitor database size
- [ ] Check user reports

---

## CI/CD Pipeline Setup

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy backend
        run: |
          cd backend
          npm install
          npm test
          git push heroku main
      
      - name: Deploy frontend
        run: |
          cd frontend
          npm install
          npm run build
          vercel --prod
```

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
brew services start mongodb-community
# or
sudo service mongod start
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Kill process on port
```bash
lsof -ti:5000 | xargs kill -9
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check `.env` FRONTEND_URL matches your frontend origin

### JWT Token Invalid
```
Token is not valid
```
**Solution**: 
- Verify `JWT_SECRET` is consistent
- Check token hasn't expired
- Verify token format in header

---

## Performance Optimization

### Frontend
```bash
# Build optimized bundle
npm run build

# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
```

### Backend
- Enable caching with Redis
- Implement database query optimization
- Use CDN for static assets
- Enable gzip compression

### Database
- Create proper indexes
- Archive old data
- Regular maintenance
- Monitor query performance

---

## Backup Strategy

### Daily Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --out /backups/mongo_$DATE
tar -czf /backups/mongo_$DATE.tar.gz /backups/mongo_$DATE
rm -rf /backups/mongo_$DATE
```

---

## Support & Resources

- **Documentation**: See `/docs` folder
- **GitHub Issues**: Report bugs here
- **Email Support**: support@shesafe.com
- **Emergency Hotline**: 1091 (India)

---

## Next Steps

1. ✅ Setup local environment
2. ✅ Test all features locally
3. ✅ Deploy backend to Heroku/AWS
4. ✅ Deploy frontend to Vercel
5. ✅ Configure domain name
6. ✅ Setup SSL certificate
7. ✅ Configure email notifications
8. ✅ Setup monitoring & alerts
9. ✅ Launch marketing campaign
10. ✅ Gather user feedback

---

**Happy deploying! 🚀**
