require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Homestay = require("./models/Homestay");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (FINAL FIX)
mongoose.connect(process.env.MONGO_URI, {
  dbName: "staylocal"
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ➕ Add homestay
app.post("/api/homestays", async (req, res) => {
  try {
    const newStay = new Homestay(req.body);
    await newStay.save();
    res.json(newStay);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get all homestays
app.get("/api/homestays", async (req, res) => {
  try {
    const stays = await Homestay.find();
    res.json(stays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete homestay
app.delete("/api/homestays/:id", async (req, res) => {
  try {
    await Homestay.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update homestay
app.put("/api/homestays/:id", async (req, res) => {
  try {
    const updatedStay = await Homestay.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStay);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Dynamic PORT (Render fix)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});