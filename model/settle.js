const mongoose = require("mongoose");

const settleSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    amount: {
      type: String,
      required: true,
    },
    sendBy: { type: String, required: true },
    receiveBy: { type: String, required: true },
    paymentMode: { type: String, required: true },
  },
  { timestamps: true }
);

const settleModel = mongoose.model("Settle", settleSchema);
module.exports = settleModel;
