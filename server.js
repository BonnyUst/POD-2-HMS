require("dotenv").config();
const app = require('./src/app'); //to import the app.js file which contains the express app and all the routes and middleware
const PORT = process.env.PORT || 5000; //specify the port to listen on, defaulting to 5000 if not set in environment variables

//http requests will be handled by the app, and the server will start listening on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`); 
});