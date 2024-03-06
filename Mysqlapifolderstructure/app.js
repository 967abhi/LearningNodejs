const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
const dbConfig = require("./src/config/dbConfig");

// Connect to MySQL
dbConfig.connect();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
