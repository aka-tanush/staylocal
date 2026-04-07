const mongoose = require("mongoose");

const homestaySchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  description: String,
});

module.exports = mongoose.model("Homestay", homestaySchema);