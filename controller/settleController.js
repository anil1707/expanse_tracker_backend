const settleModel = require("../model/settle");
const stripe = require('stripe')('sk_test_51QDiv0Kskr1hrgEpVbT1jMUO0CdgPfy2T7neTnjFmZRTR3lyI7zpOSBBsmbLsSpfowxKTP5rACJyJMq5bYsapUSY00KUW5OiIk');

const settleController = async (req, res) => {
  const { id } = req.params;
  const { amount, settleWith, paymentMode } = req.body;
  try {
    const settleDoc = await settleModel({
      tripId: id,
      amount,
      sendBy: req.user.number,
      receiveBy: settleWith,
      paymentMode,
    });
    const result = await settleDoc.save();
    if (result) res.send({ message: "Settled Successfully" });
  } catch (error) {
    res.send({ message: error });
  }
};

const historyController = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await settleModel.find({ tripId: id });
    res.send(history);
  } catch (error) {
    res.send({ message: error });
  }
};

const createIntentController = async (req, res) =>{
  console.log("hello")
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, // Amount in smallest currency unit (e.g., cents for USD)
      currency: 'usd',
      payment_method_types: ['card'],
    });
    console.log(paymentIntent)
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
    
  } catch (error) {
    console.log("error", error )
  }
}

module.exports = {
  settleController,
  historyController,
  createIntentController
};
