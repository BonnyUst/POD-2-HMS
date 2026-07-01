require("dotenv").config();
console.log("DEBUG MONGO_URL:", process.env.MONGO_URL);
const mongoose = require("mongoose");
const seedRoles = require("../utils/seedData");   // confirm this is actually roles
const seedOwner = require("../utils/seedOwner");
const seedMenus = require("../utils/seedMenus");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    console.log("Connected to DB");

    await seedRoles();
    await seedOwner();
    await seedMenus();

    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();