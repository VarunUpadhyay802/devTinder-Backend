const express = require("express");
const cors = require("cors"); // Import the cors package
const jwt = require("jsonwebtoken")
const app = express();
const port = 4000;

const connectDB = require("./config/database");
const User = require("./models/user");
const validator = require('validator');
const { validateSignUpData, validateEditProfileData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const {userAuth} = require("./middlewares/auth")

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const requestRouter = require('./routes/requests');
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);

app.use("/profile",profileRouter);

app.use("/",userRouter);
app.use("/" ,requestRouter)



app.post("/sendConnectionRequest" ,userAuth, async (req,res)=>{
    const user = req.user ; 

    console.log("Connection req sent by " + user.firstName)
    res.send("Connection request sent successfully by "+user.firstName)
})


app.get("/userByEmail", async (req, res) => {

    //extract email from the req 
    const userEmail = req.body.emailId;
    console.log(userEmail)
    try {
        const user = await User.findOne({
            emailId: userEmail
        });

        // if (user.length === 0) {
        //     res.status(404).send("User not found ")
        // } else {
        //     res.send(user);
        // }

        if (user) {
            res.send(user)
        } else {
            res.status(404).send("User not found ");
        }


    } catch (error) {
        console.log("Error fetching users" + error)
    }
})


app.get("/byId", async (req, res) => {
    const userId = req.body._id;
    console.log(userId);

    try {
        const user = await User.findById({ _id: userId })
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found ")
        }

    } catch (error) {

    }
})


app.delete("/delete", async (req, res) => {
    const userId = req.body._id;
    console.log(userId);
    const user = await User.findById({ _id: userId })
    try {
        if (user) {
            await User.findByIdAndDelete({ userId });
            res.send("User deleted successfully")
        } else {
            res.status(404).send("No user with this Id ")
        }

    } catch (error) {
        res.status(500).send("something went wrong")
    }
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


