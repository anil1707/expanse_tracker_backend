const expenseModel = require("../model/expensModel");
const tripModel = require("../model/tripModel");
const dividedInto = require("../model/dividedInto");
const { default: mongoose } = require("mongoose");
const userModel = require("../model/userModel");
const settleModel = require("../model/settle");

const allTripController = async (req, res) => {
  if (!req.user) {
    return res.json({ message: "Unauthorized user" });
  }
  try {
    const allTrip = await tripModel.find({
      $or: [
        { createdBy: req.user._id }, // Condition 1: Trip created by the user
        { friends: { $elemMatch: { number: req.user.number } } }, // Condition 2: User is in friends list
      ],
    });
    res.send(allTrip);
  } catch (error) {
    console.log(error);
  }
};

const addNewTrip = async (req, res) => {
  if (!req.user) {
    return res.json({ message: "Unauthorized user", success: false });
  }
  const { place, country, friends } = req.body;
  if (place === "" || country === "") {
    return res.json({ message: "Please fill Name and Place!", success: false });
  }
  if (friends.length < 1) {
    return res.json({
      message: "Please add atleast one Friend!",
      success: false,
    });
  }
  try {
    const collection = await tripModel({
      place,
      country,
      createdBy: req.user?._id,
      friends: [...friends, { number: req.user.number }],
    });
    const result = await collection.save();
    res.send({ message: "Trip Added Successfully!", success: true });
  } catch (err) {
    console.log(err);
  }
};

const expense = async (req, res) => {
  const { id } = req.params;
  const expenseDoc = await expenseModel
    .find({ trip: id })
    .populate("spendBy", "-password");
  const tripDetail = await tripModel.findById(id);
  res.send({
    name: tripDetail.place,
    expenseDoc,
    friends: tripDetail?.friends,
  });
};

const addExpense = async (req, res) => {
  const { title, amount, trip, friends } = req.body;
  const user = req.user;

  if (!user) {
    return res.json({ message: "Unauthorized user", success: false });
  }
  if (title === "" || amount === "") {
    return res.json({
      message: "Please fill Description and Amount!",
      success: false,
    });
  }
  if (!trip) {
    return res.json({ message: "No trip found!", success: false });
  }

  const splitInto = friends.filter((friend) => friend?.isChecked);

  try {
    const collection = await expenseModel({
      title,
      amount,
      spendBy: req.user?._id,
      trip,
      splitInto,
    });
    const result = await collection.save();

    const fn = async (friend) => {
      if (friend.isChecked) {
        let obj = {
          number: friend?.number,
          amount: +amount / splitInto.length,
          expense: result._id,
        };

        const groupDetail = await tripModel.findOne({ _id: trip });

        for (const item of groupDetail?.friends) {
          if (item._id.equals(friend._id)) {
            let newTotal = item.total + +amount / splitInto.length;

            await tripModel.findOneAndUpdate(
              { _id: trip, "friends._id": item._id },
              { $set: { "friends.$.total": newTotal } },
              { new: true }
            );
          }
        }

        const collection = await dividedInto(obj);
        await collection.save();
      }
    };

    for (const friend of friends) {
      await fn(friend);
    }

    res.send({ message: "Expense Added Successfully!", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error!", success: false });
  }
};

const addExpanseByUnequal = async (req, res) => {
  const { expanseArr, trip, title, amount } = req?.body;
  console.log("req", req.body);
  try {
    const collection = await expenseModel({
      title,
      amount,
      spendBy: req.user?._id,
      trip,
      splitInto: expanseArr,
    });
    const result = await collection.save();
    // add expanse into divided into table
    const fn = async (friend) => {
      if (friend.isChecked) {
        let obj = {
          number: friend?.number,
          amount: friend?.amount,
          expense: result._id,
        };

        const groupDetail = await tripModel.findOne({ _id: trip });

        for (const item of groupDetail?.friends) {
          if (item._id.equals(friend._id)) {
            let newTotal = item.total + +amount / splitInto.length;

            await tripModel.findOneAndUpdate(
              { _id: trip, "friends._id": item._id },
              { $set: { "friends.$.total": newTotal } },
              { new: true }
            );
          }
        }

        const collection = await dividedInto(obj);
        await collection.save();
      }
    };

    for (const friend of expanseArr) {
      await fn(friend);
    }

    res.send({ message: "Expense Added Successfully!", success: true });
  } catch (error) {
    console.log(err);
    res.status(500).send({ message: "Server Error!", success: false });
  }
};

const getIndIndividualGroupExpanse = async (req, res) => {
  const { id } = req.params;
  const { number, _id } = req.user;
  const allExpanse = await expenseModel.find({ trip: id });
  let map = {};

  for (let expanse of allExpanse) {
    const loggedInUserId = _id;
    const spendByUserId = new mongoose.Types.ObjectId(expanse.spendBy);

    if (loggedInUserId.equals(spendByUserId)) {
      // pay by logged in user
      expanse?.splitInto?.forEach((user) => {
        if (map[user?.number] && user?.number !== number) {
          map[user?.number] =
            map[user?.number] + expanse?.amount / expanse?.splitInto.length;
        } else if (number !== user?.number) {
          map[user?.number] = +expanse?.amount / expanse?.splitInto.length;
        }
      });
    } else {
      // pay by others
      if (expanse?.splitInto?.find((item) => item.number === number)) {
        // if I included
        const spendByDetail = await userModel.findById(spendByUserId);
        if (map[spendByDetail?.number]) {
          map[spendByDetail?.number] =
            map[spendByDetail?.number] -
            +expanse?.amount / expanse?.splitInto.length;
        } else {
          map[spendByDetail?.number] =
            0 - +expanse?.amount / expanse?.splitInto.length;
        }
      } else {
        //  if I not included
      }
    }
  }

  const allTransaction = await settleModel.find({ tripId: id });
  for (let item of allTransaction) {
    if (item.sendBy === number) {
      //send by me
      map[item.receiveBy] = +map[item.receiveBy] + +item.amount;
    }
    if (item.receiveBy === number) {
      //send by others
      map[item.sendBy] = +map[item.sendBy] - +item.amount;
    }
  }
  res.send(map);
};

module.exports = {
  allTripController,
  addNewTrip,
  expense,
  addExpense,
  getIndIndividualGroupExpanse,
  addExpanseByUnequal,
};
