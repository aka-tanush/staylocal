const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, addToWishlist, removeFromWishlist, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profilePicture'), updateUserProfile);

router.post('/wishlist/:homestayId', protect, addToWishlist);
router.delete('/wishlist/:homestayId', protect, removeFromWishlist);

// Admin route
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;
