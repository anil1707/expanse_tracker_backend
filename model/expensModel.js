const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    spendBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    splitInto: [
      {
        number: {
          type: String,
          required: true,
        },
        equally: Boolean,
        amount: { type: String },
      },
    ],
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  },
  { timestamps: true }
);

const expenseModel = mongoose.model("Expense", expenseSchema);
module.exports = expenseModel;
