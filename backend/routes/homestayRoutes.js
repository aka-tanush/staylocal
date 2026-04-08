const express = require('express');
const router = express.Router();
const { getHomestays, getHomestayById, createHomestay, updateHomestay, deleteHomestay, getHostHomestays } = require('../controllers/homestayController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getHomestays)
  .post(protect, authorize('host', 'admin'), upload.array('images', 5), createHomestay);

router.get('/host/mylisted', protect, authorize('host', 'admin'), getHostHomestays);

router.route('/:id')
  .get(getHomestayById)
  .put(protect, authorize('host', 'admin'), upload.array('images', 5), updateHomestay)
  .delete(protect, authorize('host', 'admin'), deleteHomestay);

module.exports = router;
