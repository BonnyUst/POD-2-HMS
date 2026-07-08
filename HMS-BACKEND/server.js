const app = require("./app");
const connectDB = require("./src/config/db");
const seedData = require('./src/utils/seedData');
const seedMenus = require('./src/utils/seedMenus');
const seedOwner = require('./src/utils/seedOwner');
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedData();
    await seedMenus();
    await seedOwner();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();