const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.file) {
        user.profilePicture = req.file.path;
      }
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePicture: updatedUser.profilePicture,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add homestay to wishlist
// @route   POST /api/users/wishlist/:homestayId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(req.params.homestayId)) {
      return res.status(400).json({ error: "Already in wishlist" });
    }
    user.wishlist.push(req.params.homestayId);
    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Remove homestay from wishlist
// @route   DELETE /api/users/wishlist/:homestayId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.homestayId);
    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, addToWishlist, removeFromWishlist, getUsers };
