const User = require('../models/User');
const DBAdapter = require('../db/dbAdapter');
const { generateToken, formatUserResponse, validateEmail, validatePhone } = require('../utils/helpers');
const { mockVerifyDigiLocker, mockVerifyOAuth } = require('../services/verificationService');

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, dateOfBirth, governmentId } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !governmentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone format' });
    }

    // Check if user exists
    let user = await DBAdapter.findUserByEmail(email);
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    user = await DBAdapter.createUser({
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      governmentId,
      verificationStatus: 'pending'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please verify with DigiLocker',
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in signup',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await DBAdapter.findUserByEmailWithPassword(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been banned'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message
    });
  }
};

exports.verifyWithDigiLocker = async (req, res) => {
  try {
    const { userId } = req; // From auth middleware
    const { documentUrl, documentType } = req.body;

    if (!documentUrl || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide document URL and type'
      });
    }

    // Call DigiLocker verification service
    const verificationResult = await mockVerifyDigiLocker(documentUrl, documentType);

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'DigiLocker verification failed'
      });
    }

    await DBAdapter.updateUser(
      { _id: userId },
      {
        isVerified: true,
        verificationStatus: 'verified',
        digiLockerVerificationId: verificationResult.verificationId,
        verificationDocument: documentUrl,
        verificationDate: new Date()
      }
    );

    const user = await DBAdapter.findUserById(userId);

    res.status(200).json({
      success: true,
      message: 'Verification successful! You now have a verified badge',
      user: formatUserResponse(user),
      verificationId: verificationResult.verificationId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Verification error',
      error: error.message
    });
  }
};

exports.oauthLogin = async (req, res) => {
  try {
    const { provider, token, profile } = req.body; // Google, Facebook, etc.

    // Verify token with OAuth provider
    const oauthResult = await mockVerifyOAuth(provider, token);

    if (!oauthResult.success) {
      return res.status(400).json({
        success: false,
        message: 'OAuth verification failed'
      });
    }

    let user = await DBAdapter.findUserByEmail(profile.email);

    if (!user) {
      user = await DBAdapter.createUser({
        firstName: profile.given_name || profile.first_name || 'User',
        lastName: profile.family_name || profile.last_name || '',
        email: profile.email,
        phone: profile.phone || '',
        password: `oauth_${Date.now()}`, // Dummy password
        dateOfBirth: profile.birthDate || new Date(),
        governmentId: `${provider}_${oauthResult.id}`,
        profilePicture: profile.picture || null,
        verificationStatus: 'pending'
      });
    }

    const jwtToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `${provider} login successful`,
      token: jwtToken,
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OAuth login error',
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await DBAdapter.findUserById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    await DBAdapter.updateUser({ _id: req.userId }, updates);
    const user = await DBAdapter.findUserById(req.userId);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};
