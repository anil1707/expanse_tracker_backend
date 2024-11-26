const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "ANILKUMARYADAV", { expiresIn: "30d" });
};

const loginController = async (req, res) => {
  const { number, password } = req.body;
  try {
    const user = await userModel.findOne({ number });
    if (!user) {
      return res.json({ message: "User not found, Please register first!" });
    }

    if (password != user.password) {
      return res.json({ message: "Invalid Phone or Password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      number: user.number,
      token: generateToken(user._id),
      message: "Login successfully",
    });
  } catch (error) {
    console.log("Error", error);
  }
};

const signupController = async (req, res) => {
  const { number, password, username } = req.body;
  if (number === "" || password === "" || username === "") {
    return res.json({ message: "Please fill all field", success: false });
  }
  if (number.length !== 10) {
    return res.json({ message: "Please enter a valid number", success: false });
  }
  try {
    const existUser = await userModel.findOne({ number });
    if (existUser) {
      return res.json({
        message: "User already exist, Please login!",
        success: false,
      });
    }
    const collection = await userModel({ number, password, name: username });
    const result = await collection.save();
    res.send({ message: "Register Successfully", success: true });
  } catch (error) {
    console.log("Error", error);
  }
};

const profileController = async (req, res) => {
  if (!req.user) {
    return res.json({ message: "Unauthorized user" });
  }
  try {
    const userDoc = await userModel.findById(req.user._id);
    res.send({ userDetail: userDoc });
  } catch (error) {
    console.log("Error", error);
  }
};

module.exports = { loginController, signupController, profileController };
