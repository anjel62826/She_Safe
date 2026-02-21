# Emergency Workflow Guide

## Overview
The emergency system is designed to ensure maximum safety for women travelers in distress. When an emergency is triggered, an automated workflow ensures immediate help and notification to all relevant parties.

## Emergency Trigger Scenarios

### 1. SOS Button Press
**Who**: User in immediate danger
**When**: User feels unsafe/under threat
**How**: Click the large red SOS button on dashboard

### 2. Unsafe Message Detection
**Who**: Any user
**When**: Chatting with bot or other users
**How**: Automatic detection of keywords like "help", "danger", "unsafe", etc.

### 3. Location Anomaly Detection
**Who**: System
**When**: User location deviates significantly from expected route
**How**: Automatic alert if user moves to flagged unsafe areas

---

## Emergency Workflow Process

```
┌─────────────────────────────────────────────────────────────┐
│ 1. EMERGENCY TRIGGERED                                      │
│    └─ User clicks SOS or system detects danger keyword     │
│    └─ Current location captured via GPS                    │
│    └─ Timestamp recorded                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. ALERT CREATION                                           │
│    └─ Create EmergencyAlert document                       │
│    └─ Severity level set (HIGH/CRITICAL)                  │
│    └─ Status: TRIGGERED                                   │
│    └─ Nearby safe zones identified                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. NOTIFICATIONS SENT                                       │
│    ├─ SMS to emergency contacts with location             │
│    ├─ Email to emergency contacts with map link           │
│    ├─ Push notification to emergency contacts             │
│    └─ Alert to nearest police stations                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. EMERGENCY DASHBOARD ACTIVATED                           │
│    ├─ Large visual SOS indicator                          │
│    ├─ Screen flashing with red color                      │
│    ├─ Loud siren sound (browser audio)                    │
│    ├─ Nearby police stations listed (< 5km)               │
│    ├─ Nearby hospitals listed                             │
│    ├─ Emergency numbers displayed                         │
│    └─ Live location map                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. EMERGENCY RESPONSE                                       │
│    ├─ Police receive location and alerts                  │
│    ├─ Emergency contacts try to reach user                │
│    ├─ Nearby safe zones show shelter/help                │
│    └─ User can call emergency numbers directly            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. SITUATION RESOLUTION                                     │
│    ├─ Admin/Responder marks alert as resolved             │
│    ├─ Confirmation sent to user                           │
│    ├─ Alert status changed to RESOLVED                    │
│    └─ Incident logged for future reference                │
└─────────────────────────────────────────────────────────────┘
```

---

## API Flow

### Trigger Emergency
```
POST /api/emergency/trigger
├─ latitude: 48.8566
├─ longitude: 2.3522
├─ message: "I feel unsafe"
└─ type: "sos_button"
```

### Get Nearby Locations
```
GET /api/emergency/nearby?latitude=48.8566&longitude=2.3522&radius=5
└─ Returns: Police stations, hospitals within 5km
```

### Get Emergency Numbers
```
GET /api/emergency/numbers
└─ Returns: Police, ambulance, helplines, etc.
```

### Resolve Emergency
```
PUT /api/emergency/alerts/:alertId/resolve
└─ Marks alert as resolved
```

---

## Notification Details

### SMS Message Template
```
🚨 EMERGENCY ALERT 🚨

{User Name} has triggered an emergency alert!

📍 Location: {latitude}, {longitude}
🕐 Time: {current_time}
📱 Message: {user_message}

⚠️  PLEASE CHECK ON THEM IMMEDIATELY

🗺️  View Location: [Google Maps Link]

For immediate help:
📞 Police: 100
📞 Ambulance: 102
📞 Women Helpline: 1091
```

### Email Message Template
```html
<h2>EMERGENCY ALERT</h2>

<p>{{ user.firstName }} {{ user.lastName }} has triggered an emergency alert!</p>

<div style="background: #ff0000; color: white; padding: 20px;">
  <p><strong>Location:</strong> {{ location.address }}</p>
  <p><strong>Coordinates:</strong> {{ latitude }}, {{ longitude }}</p>
  <p><strong>Time:</strong> {{ timestamp }}</p>
  <p><strong>Message:</strong> {{ message }}</p>
</div>

<p>
  <a href="{{ google_maps_link }}" style="background: #4CAF50; color: white; padding: 10px 20px;">
    Open in Google Maps
  </a>
</p>

<h3>Emergency Numbers</h3>
<ul>
  <li>Police: 100</li>
  <li>Ambulance: 102</li>
  <li>Fire Service: 101</li>
  <li>Women Helpline: 1091</li>
</ul>

<p>Please check on {{ user.firstName }} immediately!</p>
```

---

## Safe Zones

### Types of Safe Zones
1. **Police Stations** - Official law enforcement
2. **Hospitals** - Medical emergency help
3. **Safe Houses** - Registered safe shelters
4. **Community Centers** - Women's support centers

### Safe Zone Information
- Name and address
- Phone number and website
- Operating hours
- Services provided
- Rating and reviews
- Distance from current location
- Directions (Google Maps integration)

---

## False Alarm Protocol

### Cases
- User accidentally clicked SOS
- System false alarm from anomaly detection
- User changed mind about reporting

### Steps
1. User can cancel within 30 seconds
2. Emergency contacts notified that it was false alarm
3. Alert status changed to "false_alarm"
4. Incident logged

### Code Example
```javascript
// Cancel SOS within 30 seconds
const handleCancelSOS = async () => {
  const alert = await emergencyService.resolveEmergency(alertId, {
    notes: "False alarm - user cancelled"
  });
  // Alert status: false_alarm
};
```

---

## Keyword Detection

### Unsafe Keywords Monitored
```
- "unsafe" / "unsafety"
- "danger" / "dangerous"
- "help" / "urgent help"
- "emergency"
- "scared" / "afraid"
- "harassed" / "harassment"
- "threatened" / "threat"
- "attacked" / "attack"
- "assault" / "rape"
- "emergency"
```

### Example Detection
```
User Message: "I feel unsafe right now, need help!"
Detected Keywords: ["unsafe", "help", "emergency"]
Severity: HIGH
Action: Alert user to emergency features
```

---

## Response Time Guidelines

| Trigger Type | Expected Response | Action |
|---|---|---|
| SOS Button | Immediate | Siren + Flash |
| Police Alert | 2-5 minutes | Dispatch unit |
| Emergency Contact | Immediate | SMS/Email |
| Chat Bot | Immediate | Suggest actions |

---

## Admin Dashboard Features

### For Police/Admin
```
- View all triggered alerts
- Map view of emergency locations
- Alert details and history
- Mark as resolved
- Add responder notes
- Access to complainant details
```

### For Moderators
```
- Monitor emergency patterns
- Identify high-risk areas
- Generate safety reports
- Train community on safety
```

---

## Testing Emergency Workflow

### Local Testing
```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend
cd frontend
npm start

# 3. Login and go to /emergency
# 4. Click SOS button
# 5. Observe:
#    - Screen flashing
#    - Siren sound
#    - Nearby locations displayed
#    - Check console for notification logs
```

### Test Scenario 1: SOS Button
```javascript
// Simulate SOS click
1. Navigate to /emergency
2. Click large red SOS button
3. Verify:
   - Screen flashes red
   - Audio feedback (siren)
   - Nearby locations populated
   - Alert created in database
   - Console shows notification sends
```

### Test Scenario 2: Unsafe Message
```javascript
// Simulate message with unsafe keywords
1. Go to chat page
2. Type "I feel unsafe and need help!"
3. Send message
4. Verify:
   - Keywords detected
   - Warning shown to user
   - Suggestion to trigger emergency
   - Related safety tips displayed
```

---

## Best Practices

### For Users
1. **Keep phone charged** - Essential for location tracking
2. **Share itinerary** - Always tell someone where you're going
3. **Test features** - Test SOS button before travel
4. **Keep contacts updated** - Emergency contacts must be current
5. **Double-check before clicking** - SOS should be last resort

### For Our Team
1. **Quick response** - Police alerts within 2 minutes
2. **Verify location** - Confirm emergency location before dispatch
3. **Follow-up** - Check on user after emergency resolved
4. **Never ignore** - Take all alerts seriously
5. **Privacy first** - Protect user data throughout process

---

## Escalation Protocol

### Level 1: Immediate Safety
- User guided to nearby safe zone
- Emergency contacts notified
- Police alert sent

### Level 2: Emergency Response
- Police dispatch unit to location
- Hospital availability checked
- Emergency hotlines advised

### Level 3: Critical Situation
- All available resources mobilized
- Special women's squad if available
- Media and government agencies alerted
- Ongoing support to user

---

## Post-Emergency Support

### Immediate (0-24 hours)
- Check and ensure user is safe
- Provide counseling resources
- Document incident details

### Short-term (1-7 days)
- Follow-up calls/messages
- Mental health support referrals
- Legal assistance if needed

### Long-term (1+ months)
- Safety coaching sessions
- Travel planning assistance
- Career/skill development

---

## Statistics & Metrics

### Tracked Metrics
- Average response time
- Alert accuracy rate
- False alarm percentage
- Emergency resolution time
- User satisfaction score
- Follow-up completion rate

### Monthly Report
```
Total Alerts: 145
Resolved: 143 (98.6%)
False Alarms: 2 (1.4%)
Avg Response: 3.2 minutes
Police Dispatch: 89

Severity Breakdown:
- High: 120 (82.7%)
- Critical: 25 (17.3%)

Location Hotspots:
1. Train Stations: 32
2. Late-night Streets: 28
3. Bars/Clubs: 18
4. Remote Areas: 15
```

---

## Legal & Compliance

- All incident data encrypted
- User privacy maintained
- Police collaboration protocol
- GDPR compliant
- Regular security audits
- Incident reporting to authorities

---

For emergency support: **1091 (Women Helpline)** or use SOS button in app
