const express = require('express');

const router = express.Router();

const {
  register,
  login,
  verifyOTP,
  resendOTP,
  getMe,
} = require('../controllers/authController');

const {
  protect,
} = require('../middleware/auth');

// const { authLimiter } = require('../middleware/rateLimiter');

/*
=================================
POST /api/auth/register
=================================
*/
router.post(
  '/register',
  register
);

/*
=================================
POST /api/auth/login
=================================
Send OTP
*/
router.post(
  '/login',
  login
);

/*
=================================
POST /api/auth/verify-otp
=================================
Verify OTP and generate JWT
*/
router.post(
  '/verify-otp',
  verifyOTP
);

/*
=================================
POST /api/auth/resend-otp
=================================
Send new OTP
*/
router.post(
  '/resend-otp',
  resendOTP
);

/*
=================================
GET /api/auth/me
=================================
*/
router.get(
  '/me',
  protect,
  getMe
);

module.exports = router;