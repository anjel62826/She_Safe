// Mock SMS/Email service
const sendSMS = async (phoneNumber, message) => {
  console.log(`[SMS] Sending to ${phoneNumber}: ${message}`);
  // In production, use Twilio
  return {
    success: true,
    messageId: `SMS_${Date.now()}`,
    sentAt: new Date()
  };
};

const sendEmail = async (email, subject, htmlContent) => {
  console.log(`[EMAIL] Sending to ${email}: ${subject}`);
  // In production, use Nodemailer
  return {
    success: true,
    messageId: `EMAIL_${Date.now()}`,
    sentAt: new Date()
  };
};

const sendPushNotification = async (userId, title, message) => {
  console.log(`[NOTIFICATION] Sending to user ${userId}: ${message}`);
  return {
    success: true,
    notificationId: `NOTIF_${Date.now()}`,
    sentAt: new Date()
  };
};

module.exports = {
  sendSMS,
  sendEmail,
  sendPushNotification
};
