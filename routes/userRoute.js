const express = require("express");
const { loginController, signupController, profileController } = require("../controller/usercontroller");
const { protect } = require("../middleware/authMiddleware");

const UserRoutes = express.Router();

UserRoutes.post("/signin", loginController)
UserRoutes.post("/signup", signupController)
UserRoutes.get("/profile",protect, profileController)

module.exports = UserRoutes