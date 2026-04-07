require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Homestay = require("./models/Homestay");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Async start function (VERY IMPORTANT)
const startServer = async () => {
  try {
    // Connect DB FIRST
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "staylocal",
    });

    console.log("MongoDB Connected ✅");

    // THEN start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("MongoDB connection failed ❌", err);
  }
};

startServer();

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/api/homestays", async (req, res) => {
  try {
    const newStay = new Homestay(req.body);
    await newStay.save();
    res.json(newStay);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/homestays", async (req, res) => {
  try {
    const stays = await Homestay.find();
    res.json(stays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/homestays/:id", async (req, res) => {
  try {
    await Homestay.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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