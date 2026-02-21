// Mock DigiLocker verification service
const mockVerifyDigiLocker = async (documentUrl, documentType) => {
  try {
    // Simulate API call with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          verified: true,
          verificationId: `VERIFY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          documentType: documentType,
          verifiedAt: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });
      }, 2000);
    });
  } catch (error) {
    return {
      success: false,
      verified: false,
      error: error.message
    };
  }
};

// Mock OAuth verification
const mockVerifyOAuth = async (provider, token) => {
  try {
    // Simulate OAuth verification
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          id: `${provider}_${Math.random().toString(36).substr(2, 9)}`,
          provider: provider,
          verified: true
        });
      }, 1500);
    });
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  mockVerifyDigiLocker,
  mockVerifyOAuth
};
