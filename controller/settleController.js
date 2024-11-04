const settleModel = require("../model/settle");

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

module.exports = {
  settleController,
  historyController,
};
