const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("Attempting to connect to MongoDB...");
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    if (error.message.includes("IP that isn't whitelisted")) {
      console.error("\nPlease follow these steps to fix the IP whitelist issue:");
      console.error("1. Log in to MongoDB Atlas: https://cloud.mongodb.com");
      console.error("2. Go to Network Access in the Security section");
      console.error("3. Add your current IP address to the IP whitelist");
      console.error("4. Or add 0.0.0.0/0 to allow access from anywhere (not recommended for production)");
    }
    // Don't exit the process, just log the error
    // This allows the server to continue running even if MongoDB connection fails
    // The travel planner can still work without MongoDB
  }
};

module.exports = connectDB;
