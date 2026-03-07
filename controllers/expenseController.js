const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// Add expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    const expense = new Expense({
      userId: req.user.userId,
      amount,
      category,
      description,
      date: date || Date.now()
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user expenses
// Get all user expenses with filters
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { category, startDate, endDate, year, month } = req.query;

    let filter = { userId };

    // 🔹 Filter by category
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    // 🔹 Filter by date range
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 🔹 Filter by year
    if (year) {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31, 23, 59, 59);

      filter.date = { $gte: start, $lte: end };
    }

    // 🔹 Filter by month (with optional year)
    if (month) {
      const selectedYear = year || new Date().getFullYear();

      const start = new Date(selectedYear, month - 1, 1);
      const end = new Date(selectedYear, month, 0, 23, 59, 59);

      filter.date = { $gte: start, $lte: end };
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const { amount, category, description, date } = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: expenseId,
        userId: req.user.userId, // 🔥 security
      },
      { amount, category, description, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCategorySummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};