const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");
const travelRoutes = require("./routes/travelRoutes");

// Load environment variables
dotenv.config();
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('NEWS_API_KEY:', process.env.NEWS_API_KEY ? 'Set' : 'Not set');
console.log('WEATHER_API_KEY:', process.env.WEATHER_API_KEY ? 'Set' : 'Not set');

// Connect to MongoDB
connectDB();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/travel", travelRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is fully running on port ${PORT}`);
});
