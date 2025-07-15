// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // This loads your .env variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});
