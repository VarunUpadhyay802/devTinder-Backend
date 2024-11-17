const express = require('express');
const userRouter = express.Router();

const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionReques');
const { userAuth } = require("../middlewares/auth")

//get all the pending connection requests for the logged in user
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {

    try {
        //userAuth have attached the user 
        const loggedInUser = req.user
        const ConnectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName");

        res.json({
            message: "Data fetched Successfully",
            data: ConnectionRequests
        })

    } catch (error) {
        res.status(400).send("Error : ", error.message);
    }

})
//if steve sent a request to mark then mark should get the details of stev or who has accpted my req or who is my connection
//basically the people who are connected to you 
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const ConnectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id, status: "accepted"
                }, {
                    fromUserID: loggedInUser._id, status: "accepted"
                }
            ],
        }).populate("fromUserId", USER_SAFE_DATA);
        
        //now those connection requests with fromUserID will be our connections 
        const data = ConnectionRequests.map((row) => row.fromUserId)

        res.json({
            message: "succesful",
            data
        })

    } catch (error) {
        // res.status(400).send("Error : ", error.message);
        res.status(500).send(error)
    }
})


userRouter.patch("/user/:userId", userAuth, async (req, res) => {
    //data that needs to be updated
    const data = req.body;
    const userId = req.params?.userId;

    try {
        //validation 
        if (!validateEditProfileData(data)) {
            throw new Error("Update not allowed");
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "before",
            runValidators: true,
        });
        // console.log(user);
        res.send("user updated succesfully");
    } catch (error) {
        res.status(400).send("Something went wrong " + error)
    }
})

module.exports = userRouter
