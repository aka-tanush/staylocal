const Homestay = require('../models/Homestay');

// @desc    Get all homestays (with search/filter)
// @route   GET /api/homestays
// @access  Public
const getHomestays = async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      $or: [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { location: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};
    
    // Pagination
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Homestay.countDocuments({ ...keyword });
    
    const homestays = await Homestay.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      
    res.json({ homestays, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get homestay by ID
// @route   GET /api/homestays/:id
// @access  Public
const getHomestayById = async (req, res) => {
  try {
    const homestay = await Homestay.findById(req.params.id).populate('hostId', 'name email phone');
    if (homestay) {
      res.json(homestay);
    } else {
      res.status(404).json({ error: 'Homestay not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a homestay
// @route   POST /api/homestays
// @access  Private/Host
const createHomestay = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;
    
    // Handle multiple image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    const homestay = new Homestay({
      title,
      description,
      price,
      location,
      images,
      hostId: req.user._id,
    });

    const createdHomestay = await homestay.save();
    res.status(201).json(createdHomestay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a homestay
// @route   PUT /api/homestays/:id
// @access  Private/Host
const updateHomestay = async (req, res) => {
  try {
    const homestay = await Homestay.findById(req.params.id);

    if (homestay) {
      if (homestay.hostId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(403).json({ error: 'Not authorized to update this homestay' });
      }

      homestay.title = req.body.title || homestay.title;
      homestay.description = req.body.description || homestay.description;
      homestay.price = req.body.price || homestay.price;
      homestay.location = req.body.location || homestay.location;

      if (req.files && req.files.length > 0) {
        homestay.images = req.files.map(file => file.path);
      }

      const updatedHomestay = await homestay.save();
      res.json(updatedHomestay);
    } else {
      res.status(404).json({ error: 'Homestay not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a homestay
// @route   DELETE /api/homestays/:id
// @access  Private/Host or Admin
const deleteHomestay = async (req, res) => {
  try {
    const homestay = await Homestay.findById(req.params.id);

    if (homestay) {
      if (homestay.hostId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(403).json({ error: 'Not authorized to delete this homestay' });
      }
      await homestay.deleteOne();
      res.json({ message: 'Homestay removed' });
    } else {
      res.status(404).json({ error: 'Homestay not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get homestays owned by host
// @route   GET /api/homestays/host/mylisted
// @access  Private/Host
const getHostHomestays = async (req, res) => {
  try {
    const homestays = await Homestay.find({ hostId: req.user._id });
    res.json(homestays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getHomestays, getHomestayById, createHomestay, updateHomestay, deleteHomestay, getHostHomestays };
