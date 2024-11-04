const express = require("express");
const { settleController, historyController } = require("../controller/settleController");
const { protect } = require("../middleware/authMiddleware");

const SettleRoutes = express.Router();

SettleRoutes.post("/settle/:id", protect, settleController)
SettleRoutes.get("/history/:id", protect, historyController)

module.exports = SettleRoutes;