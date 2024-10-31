const mongoose = require("mongoose");

const db_connnect = () => {
  mongoose
    .connect(
      "mongodb+srv://yadavanil1707ax:EgjgvyMfcK8f9RCC@cluster0.attffw2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("Database connected successfuly!");
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
};

module.exports = db_connnect
