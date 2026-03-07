const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getCategorySummary
} = require("../controllers/expenseController");

router.post("/", authMiddleware, addExpense);
router.get("/category-summary", authMiddleware, getCategorySummary);
router.get("/", authMiddleware, getExpenses);
router.delete("/:id", authMiddleware, deleteExpense);
router.put("/:id", authMiddleware, updateExpense);


module.exports = router;