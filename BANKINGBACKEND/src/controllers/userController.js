const User = require('../models/User');
const Account = require('../models/Account');
const { apiResponse } = require('../utils/helpers');

// ===============================
// GET PROFILE
// ===============================
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'accounts',
      select:
        'accountNumber balance accountType currency isActive createdAt',
    });

    return apiResponse(res, 200, 'Profile retrieved.', {
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['fullName'];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return apiResponse(
        res,
        400,
        'Only fullName can be updated.'
      );
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    return apiResponse(
      res,
      200,
      'Profile updated successfully.',
      { user }
    );
  } catch (error) {
    next(error);
  }
};

// ===============================
// CHANGE PASSWORD
// ===============================
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return apiResponse(
        res,
        400,
        'Current and new password are required.'
      );
    }

    if (newPassword.length < 8) {
      return apiResponse(
        res,
        400,
        'New password must be at least 8 characters.'
      );
    }

    const user = await User.findById(
      req.user._id
    ).select('+password');

    const isMatch =
      await user.comparePassword(currentPassword);

    if (!isMatch) {
      return apiResponse(
        res,
        401,
        'Current password is incorrect.'
      );
    }

    user.password = newPassword;

    await user.save();

    return apiResponse(
      res,
      200,
      'Password changed successfully.'
    );
  } catch (error) {
    next(error);
  }
};

// ===============================
// GET USERS
// Manager -> employees/customers
// Employee -> customers only
// ===============================
const getAllUsers = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'manager') {
      if (req.query.role) {
        filter.role = req.query.role;
      }
    }

    else if (req.user.role === 'employee') {
      filter.role = 'customer';
    }

    else {
      return apiResponse(
        res,
        403,
        'Access denied.'
      );
    }

    const users = await User.find(filter)
      .select('-password')
      .populate({
        path: 'accounts',
        select:
          'accountNumber balance accountType currency isActive',
      })
      .sort({ createdAt: -1 });

    return apiResponse(
      res,
      200,
      'Users retrieved successfully.',
      { users }
    );
  } catch (error) {
    next(error);
  }
};

// ===============================
// GET USER BY ID
// ===============================
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.params.id
    ).populate({
      path: 'accounts',
      select:
        'accountNumber balance accountType currency isActive createdAt',
    });

    if (!user) {
      return apiResponse(
        res,
        404,
        'User not found.'
      );
    }

    /*
      Employee cannot view employees/managers
    */
    if (
      req.user.role === 'employee' &&
      user.role !== 'customer'
    ) {
      return apiResponse(
        res,
        403,
        'Employees can only view customers.'
      );
    }

    return apiResponse(
      res,
      200,
      'User retrieved successfully.',
      { user }
    );
  } catch (error) {
    next(error);
  }
};

// ===============================
// ACTIVATE / DEACTIVATE USER
// Manager Only
// ===============================
const toggleUserStatus = async (
  req,
  res,
  next
) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return apiResponse(
        res,
        400,
        '"isActive" must be true or false.'
      );
    }

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return apiResponse(
        res,
        404,
        'User not found.'
      );
    }

    /*
      Manager cannot deactivate himself
    */
    if (
      user._id.equals(req.user._id)
    ) {
      return apiResponse(
        res,
        400,
        'You cannot deactivate your own account.'
      );
    }

    user.isActive = isActive;

    await user.save({
      validateBeforeSave: false,
    });

    await Account.updateMany(
      { userId: user._id },
      { isActive }
    );

    return apiResponse(
      res,
      200,
      `User ${
        isActive
          ? 'activated'
          : 'deactivated'
      } successfully.`,
      { user }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  toggleUserStatus,
};