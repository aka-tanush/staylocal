const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  homestayId: { type: mongoose.Schema.Types.ObjectId, ref: "Homestay", required: true },
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
