const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  toggleUserStatus,
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

/*
=================================
All routes require authentication
=================================
*/
router.use(protect);

/*
=================================
COMMON ROUTES
=================================
*/

// Get own profile
router.get('/profile', getProfile);

// Update own profile
router.patch('/profile', updateProfile);

// Change own password
router.patch('/change-password', changePassword);

/*
=================================
MANAGER ROUTES
=================================
*/

// Manager can see all employees/customers
router.get(
  '/manager/all',
  authorize('manager'),
  getAllUsers
);

// Manager can get specific user
router.get(
  '/manager/:id',
  authorize('manager'),
  getUserById
);

// Manager can activate/deactivate users
router.patch(
  '/manager/:id/status',
  authorize('manager'),
  toggleUserStatus
);

/*
=================================
EMPLOYEE ROUTES
=================================
*/

// Employee can only see customer details
router.get(
  '/employee/customers',
  authorize('employee'),
  getAllUsers
);

module.exports = router;