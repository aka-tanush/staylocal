const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getHostBookings, cancelBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking);

router.get('/mybookings', protect, getMyBookings);
router.get('/host', protect, authorize('host', 'admin'), getHostBookings);

router.route('/:id')
  .delete(protect, cancelBooking);

module.exports = router;
