const express = require("express")

const app = express();
const port = 4000;
const connectDB = require("./config/database");
const User = require("./models/user")
app.use(express.json())

app.post("/signup", async (req, res) => {
    // //creating a new instance of the User model || just creating  a new user with the data we are getting
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully")
    } catch (err) {
        res.status(400).send("Error saving the error:" + err.message)
    }
    // const userObj = {
    //     firstName: "Ritik",
    //     lastName: "Kumar",
    //     emailId: "ritik.iu@gmail.com",
    //     password: "ritik@123"
    // }
    // //creating a new instance of the User model
    // const user = new User(userObj);
    // try {
    //     await user.save();
    //     res.send("User Added successfully")
    // } catch (err) {
    //     res.status(400).send("Error saving user to the DB" + err.message)
    // }
})

connectDB().then(() => {
    console.log("Connected to the DB Successfully")
    app.listen(4000, () => {
        console.log(`server is running on port ${port}`)
    })
}).catch((err) => {
    console.log(err)
    console.error("Problem connecting to the DB")
})


