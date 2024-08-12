const express = require("express");
const app = express();

// Load environment variables from .env file
require("dotenv").config();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
const dbConnect = require("./config/dbConnect");
dbConnect();

// Import routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

// Use routes for authentication and todos
app.use("/api/v1", authRoutes);
app.use("/api/v1", todoRoutes);

// Default route to check server status
app.get("/", (req, res) => {
  res.json({ message: "Your Server is up and running..." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res
    .status(500)
    .json({ message: "something went wrong!", error: err.message });
});

// Start the server on the specified port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
