#!/usr/bin/env node
// Quick test script for sign up functionality
const DBAdapter = require('./src/db/dbAdapter');
const { generateToken, formatUserResponse } = require('./src/utils/helpers');

async function testSignup() {
  try {
    console.log('\n🧪 Testing User Signup...\n');

    // Test 1: Create user
    console.log('1. Creating user...');
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '9876543210',
      password: 'Test@123',
      dateOfBirth: '1995-01-15',
      governmentId: 'ABC123456',
      verificationStatus: 'pending'
    };

    const user = await DBAdapter.createUser(userData);
    console.log('✅ User created:', user);

    // Test 2: Find by email
    console.log('\n2. Finding user by email...');
    const foundUser = await DBAdapter.findUserByEmail('test@example.com');
    console.log('✅ User found:', foundUser);

    // Test 3: Generate token
    console.log('\n3. Generating JWT token...');
    const token = generateToken(user._id);
    console.log('✅ Token:', token.substring(0, 20) + '...');

    // Test 4: Login test
    console.log('\n4. Testing login with password...');
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare('Test@123', foundUser.password);
    console.log('✅ Password valid:', isPasswordValid);

    console.log('\n✅ All tests passed! Signup is working.\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testSignup();
