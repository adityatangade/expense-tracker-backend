const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getCategorySummary,
  getMonthlySummary
} = require("../controllers/dashBoardController");

router.get("/category-summary", authMiddleware, getCategorySummary);
router.get("/monthly-summary", authMiddleware, getMonthlySummary);

module.exports = router;