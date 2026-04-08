const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  homestayId: { type: mongoose.Schema.Types.ObjectId, ref: "Homestay" },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating:     { type: Number, required: true },
  comment:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);