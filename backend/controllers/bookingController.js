const Booking = require('../models/Booking');
const Homestay = require('../models/Homestay');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { homestayId, checkInDate, checkOutDate, guests } = req.body;

    const homestay = await Homestay.findById(homestayId);
    if (!homestay) {
      return res.status(404).json({ error: 'Homestay not found' });
    }

    // Calculate total price based on dates (Simple logic)
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
      return res.status(400).json({ error: 'Invalid dates' });
    }

    const totalPrice = days * homestay.price;

    const booking = new Booking({
      homestayId,
      touristId: req.user._id,
      hostId: homestay.hostId,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get logged in user (tourist) bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ touristId: req.user._id }).populate('homestayId', 'title image location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get host bookings
// @route   GET /api/bookings/host
// @access  Private/Host
const getHostBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ hostId: req.user._id }).populate('touristId', 'name email').populate('homestayId', 'title');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (booking.touristId.toString() !== req.user._id.toString() && booking.hostId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(403).json({ error: 'Not authorized to cancel this booking' });
      }
      
      booking.status = 'Cancelled';
      await booking.save();
      res.json({ message: 'Booking cancelled updated' });
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getHostBookings, cancelBooking };
