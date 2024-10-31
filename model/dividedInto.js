const mongoose = require("mongoose");

const dividedIntoSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    expense: { type: mongoose.Schema.Types.ObjectId, ref: "Expense" },
  },
  { timestamps: true }
);

const dividedIntoModel = mongoose.model("DividedInto", dividedIntoSchema);
module.exports = dividedIntoModel;
