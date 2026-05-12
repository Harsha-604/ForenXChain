const mongoose = require('mongoose');
require('dotenv').config();

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB...");
  
  // This drops all old "Unique" rules for the Evidence collection
  await mongoose.connection.collection('evidences').dropIndexes();
  console.log("✅ Old indexes dropped successfully!");
  
  process.exit();
}

fix();
