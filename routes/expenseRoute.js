const express = require("express");
const {
  allTripController,
  addNewTrip,
  expense,
  addExpense,
  getIndIndividualGroupExpanse,
  addExpanseByUnequal,
} = require("../controller/expenseController");
const { protect } = require("../middleware/authMiddleware");

const expenseRoute = express.Router();

expenseRoute.get("/all-trip", protect, allTripController);
expenseRoute.post("/add-trip", protect, addNewTrip);
expenseRoute.get("/expense/:id", protect, expense); // get expense of a trip
expenseRoute.post("/addExpense", protect, addExpense);
expenseRoute.post("/addExpenseUnequally", protect, addExpanseByUnequal);
expenseRoute.get(
  "/indivudualGroupExpanse/:id",
  protect,
  getIndIndividualGroupExpanse
);

module.exports = expenseRoute;
