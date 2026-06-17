const User = require('../models/User');
const otpGenerator = require('otp-generator');

const {
  generateToken,
  apiResponse,
} = require('../utils/helpers');

const sendEmail = require('../utils/sendEmail');

/*
==========================
POST /api/auth/register
==========================
Public registration disabled
*/
const register = async (req, res) => {
  return apiResponse(
    res,
    403,
    'Self registration is disabled. Please contact the bank.'
  );
};

/*
==========================
POST /api/auth/login
==========================
Send OTP instead of JWT
*/
const login = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    if (!email || !password) {
      return apiResponse(
        res,
        400,
        'Email and password are required.'
      );
    }

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      }).select(
        '+password'
      );

    if (!user) {
      return apiResponse(
        res,
        401,
        'Invalid email or password.'
      );
    }

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      return apiResponse(
        res,
        401,
        'Invalid email or password.'
      );
    }

    if (!user.isActive) {
      return apiResponse(
        res,
        403,
        'Your account has been deactivated.'
      );
    }

    /*
    Prevent wrong role login
    */
    if (
      role &&
      user.role !== role
    ) {
      return apiResponse(
        res,
        403,
        `This account is not registered as ${role}.`
      );
    }

    /*
    Generate 6-digit OTP
    */
    const otp =
      otpGenerator.generate(
        6,
        {
          upperCaseAlphabets:
            false,

          lowerCaseAlphabets:
            false,

          specialChars:
            false,

          alphabets: false,
        }
      );

    /*
    Save OTP for 5 minutes
    */
    user.otp = otp;

    user.otpExpires =
      new Date(
        Date.now() +
          5 * 60 * 1000
      );

    await user.save({
      validateBeforeSave:
        false,
    });

    /*
    Send OTP Email
    */
    await sendEmail(
      user.email,

      'Bandhan Bank Login OTP',

      `
      <div style="font-family:Arial;padding:20px;">
        <h2>Bandhan Bank</h2>

        <p>
          Dear ${user.fullName},
        </p>

        <p>
          Your OTP for login is:
        </p>

        <h1>
          ${otp}
        </h1>

        <p>
          This OTP is valid for 5 minutes.
        </p>

        <p>
          Do not share this OTP with anyone.
        </p>
      </div>
      `
    );

    return apiResponse(
      res,
      200,
      'OTP sent successfully.',
      {
        email: user.email,
      }
    );
  } catch (error) {
    next(error);
  }
};
/*
==========================
POST /api/auth/verify-otp
==========================
*/
const verifyOTP = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return apiResponse(
        res,
        400,
        'Email and OTP are required.'
      );
    }

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (!user) {
      return apiResponse(
        res,
        404,
        'User not found.'
      );
    }

    if (
      !user.otp ||
      user.otp !== otp
    ) {
      return apiResponse(
        res,
        401,
        'Invalid OTP.'
      );
    }

    if (
      !user.otpExpires ||
      user.otpExpires <
        new Date()
    ) {
      return apiResponse(
        res,
        401,
        'OTP has expired.'
      );
    }

    /*
    Clear OTP
    */
    user.otp = null;

    user.otpExpires =
      null;

    user.lastLogin =
      new Date();

    await user.save({
      validateBeforeSave:
        false,
    });

    /*
    Generate JWT
    */
    const token =
      generateToken(
        user._id,
        user.role
      );

    return apiResponse(
      res,
      200,
      'OTP verified successfully.',
      {
        token,
        user,
      }
    );
  } catch (error) {
    next(error);
  }
};

/*
==========================
POST /api/auth/resend-otp
==========================
*/
const resendOTP = async (
  req,
  res,
  next
) => {
  try {
    const { email } =
      req.body;

    if (!email) {
      return apiResponse(
        res,
        400,
        'Email is required.'
      );
    }

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (!user) {
      return apiResponse(
        res,
        404,
        'User not found.'
      );
    }

    const otp =
      otpGenerator.generate(
        6,
        {
          upperCaseAlphabets:
            false,

          lowerCaseAlphabets:
            false,

          specialChars:
            false,

          alphabets:
            false,
        }
      );

    user.otp = otp;

    user.otpExpires =
      new Date(
        Date.now() +
          5 * 60 * 1000
      );

    await user.save({
      validateBeforeSave:
        false,
    });

    await sendEmail(
      user.email,

      'Bandhan Bank Login OTP',

      `
      <div style="font-family:Arial;padding:20px;">
        <h2>Bandhan Bank</h2>

        <p>
          Dear ${user.fullName},
        </p>

        <p>
          Your new OTP is:
        </p>

        <h1>
          ${otp}
        </h1>

        <p>
          This OTP is valid for 5 minutes.
        </p>
      </div>
      `
    );

    return apiResponse(
      res,
      200,
      'OTP resent successfully.'
    );
  } catch (error) {
    next(error);
  }
};

/*
==========================
GET /api/auth/me
==========================
*/
const getMe = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).populate(
        'accounts'
      );

    return apiResponse(
      res,
      200,
      'Profile retrieved.',
      {
        user,
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,

  login,

  verifyOTP,

  resendOTP,

  getMe,
};