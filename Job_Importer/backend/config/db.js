const MONGO_URI = process.env.MONGO_URI;
const mongoose = require('mongoose');

//database connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected..");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

module.exports = {connectDB} ;