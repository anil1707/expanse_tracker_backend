const express = require('express')
const db_connnect = require("./db");
const UserRoutes = require('./routes/userRoute');
const expenseRoute = require('./routes/expenseRoute');

const app = express();
db_connnect()
app.use(express.json())

app.use("/api/v1", UserRoutes)
app.use("/api/v1", expenseRoute)


app.listen(5000, (error)=>{
    if(error){
        console.log("Error: ", error)
    }
    console.log("Server is running on port ", 5000)
})