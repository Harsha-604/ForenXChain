// server/create-admin.js (Updated for debugging)
const mongoose = require('mongoose');
const dns = require('dns');
const User = require('./models/User'); 
require('dotenv').config();

// Force Node.js to use Google's DNS to resolve the MongoDB SRV record
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function createAdmin() {
  console.log("🔍 Attempting to connect to:", process.env.MONGO_URI.split('@')[1]); // Log host only for safety
  
  try {
    // 1. Connect with Timeout to avoid hanging
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 
    });
    console.log("✅ Database Connected Successfully!");

    const adminEmail = "admin@forenxchain.com";
    const adminPassword = "AdminPass123"; 

    let user = await User.findOne({ email: adminEmail });
    
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log("✅ Admin role restored for existing user:", adminEmail);
    } else {
      user = await User.create({
        name: "Main Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin"
      });
      console.log("🚀 New Admin Created Successfully!");
      console.log("📧 Email:", adminEmail);
      console.log("🔑 Password:", adminPassword);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ CONNECTION FAILED!");
    console.error("Reason:", error.message);
    console.log("\n💡 QUICK FIX TIPS:");
    console.log("1. Check if your IP is whitelisted in MongoDB Atlas (Network Access).");
    console.log("2. Check if there is a typo in MONGO_URI in your .env file.");
    console.log("3. If you're on a restricted network (Office/Uni), try the 'Standard Connection String' from Atlas.");
    process.exit(1);
  }
}

createAdmin();
