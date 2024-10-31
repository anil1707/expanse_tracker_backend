const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    place: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    friends: [
      {
        number: { type: String, required: true },
        total: { type: Number,  default:0},
      },
    ],
  },
  { timestamps: true }
);

const tripModel = mongoose.model("Trip", tripSchema);
module.exports = tripModel;
