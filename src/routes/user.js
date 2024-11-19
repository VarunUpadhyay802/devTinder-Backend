const express = require('express');
const userRouter = express.Router();

const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionReques');
const { userAuth } = require("../middlewares/auth");


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
                    fromUserId: loggedInUser._id, status: "accepted"
                }
            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        //now those connection requests with fromUserID will be our connections 
        // console.log(ConnectionRequests);
        //now we are checking which user to send back , because we can have both 
        const data = ConnectionRequests.map((row) => {
            //you can't compare two mongoDB id's , so you are comparing the strings inside the objectID
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        if(data.length==0) return res.send("No Connections ")
        res.json({ data });

    } catch (error) {
        // res.status(400).send("Error : ", error.message);
        res.status(500).send(error)
    }
})
//gets you the profile of other users on platform
userRouter.get("/user/feed", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        //find all the connection requests which are pending , so those users can't be in the feed right 
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, },
                { toUserId: loggedInUser._id }
            ],
            status: { $nin: ["ignored"] }
        }).select("fromUserId , toUserId");

        //logic is : return me the userId other then loggedInuser Id
        const hideUsersFromFeed = new Set ();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        // console.log(hideUsersFromFeed);
        // const users = await User.find({
        //     _id : {$nin : Array.from(hideUsersFromFeed)}
        // })
        // first we did like  above then we needed another condition so we combined them in and operator

        const users = await User.find({
            $and:[
                {_id: {$nin : Array.from(hideUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
                
            ]
        }).select(USER_SAFE_DATA)
        res.send(users)
    } catch (error) {
        // res.status(400).send("Error : ", error.message);
        res.status(500).send(error.message)
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
