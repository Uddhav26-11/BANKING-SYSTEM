const User = require('../models/User');
const { generateToken, apiResponse } = require('../utils/helpers');

// ==========================
// POST /api/auth/register
// ==========================
// Public registration disabled
const register = async (req, res) => {
  return apiResponse(
    res,
    403,
    'Self registration is disabled. Please contact the bank.'
  );
};

// ==========================
// POST /api/auth/login
// ==========================
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return apiResponse(
        res,
        400,
        'Email and password are required.'
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select('+password');

    if (!user) {
      return apiResponse(
        res,
        401,
        'Invalid email or password.'
      );
    }

    const isMatch = await user.comparePassword(password);

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
      Frontend sends:
      manager
      employee
      customer

      Prevent logging into the wrong role.
    */
    if (role && user.role !== role) {
      return apiResponse(
        res,
        403,
        `This account is not registered as ${role}.`
      );
    }

    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    const token = generateToken(
      user._id,
      user.role
    );

    return apiResponse(
      res,
      200,
      'Login successful.',
      {
        token,
        user,
      }
    );
  } catch (error) {
    next(error);
  }
};

// ==========================
// GET /api/auth/me
// ==========================
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.user._id
    ).populate('accounts');

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
  getMe,
};