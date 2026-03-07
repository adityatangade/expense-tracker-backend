const Expense = require("../models/Expense");
const mongoose = require("mongoose");

exports.getCategorySummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    let matchStage = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    let startDate, endDate;

    if (year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } 
    else if (year) {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    } 
    else if (month) {
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear, month - 1, 1);
      endDate = new Date(currentYear, month, 0, 23, 59, 59);
    }

    if (startDate && endDate) {
      matchStage.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const summary = await Expense.aggregate([
      {
        $match: matchStage
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


exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const year = parseInt(req.query.year);

    let matchStage = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      matchStage.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const summary = await Expense.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    res.json(summary);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};