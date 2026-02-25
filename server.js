require("dotenv").config();
const express = require("express");
const app = express();

const connectDB = require("./config/db");

// Middleware
app.use(express.json());

// Database connection
connectDB();

// Auth
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Expense
const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Expense Tracker API running...");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});